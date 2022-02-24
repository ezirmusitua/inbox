import { DateTime } from "luxon";
import { iDayArticleData } from "pages/Today/context";
import article from "resource/article";

export interface iArticleListProps extends iDayArticleData {
    on_remove: (article: any) => Promise<void>;
}

export default function ArticleList({
    title,
    items,
    on_remove,
}: iArticleListProps) {
    async function remove_item(item) {
        await article.remove_article(item._id);
        on_remove(item);
    }
    return (
        <div>
            <h2 className="text-2xl py-4">{title}</h2>
            <ul>
                {items.map((article, j) => (
                    <li key={j} className="py-2">
                        <div className="flex justify-between">
                            <p className="text-gray-600 text-lg">
                                {DateTime.fromJSDate(article.saved_at).toFormat(
                                    "LLL dd, yyyy HH:mm",
                                )}
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => remove_item(article)}
                                    className="text-red-400"
                                >
                                    删除
                                </button>
                            </div>
                        </div>
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xl underline underline-offset-8 hover:text-gray-900 text-gray-700"
                        >
                            {article.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
