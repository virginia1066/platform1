import { Word, WordSourcePrefix, WordStatus } from '../types/Wokobular';
import { GaxiosResponse } from 'gaxios/build/src/common';
import { sheets_v4 } from 'googleapis/build/src/apis/sheets/v4';
import { head, pipe, trim, toLower } from 'ramda';
import { google } from 'googleapis';
import { GOOGLE_SHEETS_API_KEY, GOOGLE_SHEETS_ID, MAX_WORD_LENGTH } from '../constants';
import { warn } from './log';

function getColumnIndex(columnCount: number): string {
    let columnIndex = '';
    let quotient = columnCount;
    while (quotient > 0) {
        const remainder = (quotient - 1) % 26;
        columnIndex = String.fromCharCode(65 + remainder) + columnIndex;
        quotient = Math.floor((quotient - remainder) / 26);
    }
    return columnIndex;
}

const parse_sheets = (response: GaxiosResponse<sheets_v4.Schema$Spreadsheet>): Record<string, Array<ParsedWord>> => {
    const sheets = (response.config.params.ranges! as Array<string> ?? [])
        .map((range) => head(range.split('!'))!)
        .map(trim);

    const extract_value = (item: sheets_v4.Schema$CellData): string =>
        String(item!.effectiveValue!.stringValue! ?? item!.effectiveValue!.numberValue ?? '');

    return sheets.reduce((acc, sheet_name, index) => {
        const sheet = response.data.sheets![index];
        const raw_data = sheet.data![0].rowData!;
        const google_titles = raw_data[0];
        const rows = raw_data.slice(1);
        type Title = 'ru' | 'en' | 'disabled';

        const titles = google_titles.values!.map(pipe(extract_value, toLower));

        const table = rows
            .map((row) => row.values!.map(extract_value))
            .reduce((acc, values) => {

                const word = titles.reduce<ParsedWord>((acc, title, index) => {
                    const value = values[index];
                    switch (title as Title) {
                        case 'en':
                            acc.en = value.trim();
                            break;
                        case 'ru':
                            acc.ru = value.trim();
                            break;
                        case 'disabled':
                            acc.status = Boolean(value) ? WordStatus.Deleted : WordStatus.Active;
                            break;
                    }
                    return acc;
                }, Object.assign(Object.create(null), { source: `${WordSourcePrefix.GoogleSheets}-${sheet_name}` }));

                if (word.ru && word.en) {
                    if (word.ru.length <= MAX_WORD_LENGTH && word.en.length <= MAX_WORD_LENGTH) {
                        acc.push(word);
                    } else {
                        warn(`Wrong word from google sheets ${sheet_name} length!`, word);
                    }
                }
                return acc;
            }, [] as Array<ParsedWord>);

        return Object.assign(acc, { [sheet_name]: table });
    }, Object.create(null));
};

export const get_google_wokobular = (): Promise<Record<string, Array<ParsedWord>>> => {
    const sheets = google.sheets({
        version: 'v4',
        auth: GOOGLE_SHEETS_API_KEY
    });

    return sheets.spreadsheets.get({
        spreadsheetId: GOOGLE_SHEETS_ID,
        fields: 'sheets.properties',
    }).then((response) => {
        const pages = response.data.sheets?.map(sheet => sheet.properties!) || [];
        return sheets.spreadsheets.get({
            spreadsheetId: GOOGLE_SHEETS_ID,
            fields: 'sheets.data.rowData.values.effectiveValue',
            ranges: pages.map((page) => `${page!.title}!A1:${getColumnIndex(page!.gridProperties!.columnCount!)}${page!.gridProperties!.rowCount}`)
        });
    }).then(parse_sheets);
};

type ParsedWord = Omit<Word, 'id' | 'insert_id'>;