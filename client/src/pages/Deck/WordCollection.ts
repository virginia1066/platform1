import { Word } from '../../types/vocabulary';
import { always, evolve, ifElse, isNil, not, pipe, prop, propEq } from 'ramda';

export class WordCollection {
    public readonly active_word: Word<unknown> | undefined;
    private readonly new_list: Array<Word<null>> = [];
    private readonly repeated: Array<Word<number>> = [];

    private constructor(new_list: Array<Word<null>>, repeated_list: Array<Word<number>>) {
        this.new_list = new_list;
        this.repeated = repeated_list;
        const now = Date.now();

        repeated_list.forEach((word) => {
            const date = new Date(word.due);
            const tpl = [
                date.toLocaleDateString(),
                date.toLocaleTimeString()
            ].join(' ')
        });

        this.active_word = repeated_list
            .find(({ due }) => now >= due) ?? new_list[0];
    }

    public update(word: Word<string>): WordCollection {
        const new_list = this.new_list.filter(pipe(propEq(word.id, 'id'), not));
        const repeated = [
            ...this.repeated.filter(pipe(propEq(word.id, 'id'), not)),
            { ...word, due: new Date(word.due).getTime() }
        ].sort(WordCollection.comparator);

        return new WordCollection(new_list, repeated);
    }

    public static create(list: Array<Word>) {
        type Check<T> = (data: Word<unknown>) => data is Word<T>;

        const number_or_null: Array<Word<number | null>> = list.map(evolve({
            due: ifElse<string | null, null, null, number>(isNil, always(null), (date: string) => new Date(date).getTime())
        }));

        const new_list = number_or_null.filter(pipe(prop('due'), isNil) as Check<null>);
        const repeated = number_or_null
            .filter<Word<number>>(pipe(prop('due'), isNil, not) as Check<number>)
            .sort(WordCollection.comparator);

        return new WordCollection(new_list, repeated);
    }

    public static comparator(a: Word<number>, b: Word<number>) {
        return a.due - b.due;
    }
}