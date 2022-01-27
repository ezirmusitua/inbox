import { iDayArticleData } from "frontend/pages/Today.store";
import { DateTime } from "luxon";
import { iArticle } from "shared/article";

export interface iArticleListProps extends iDayArticleData {
    on_save: (article: iArticle) => Promise<void>;
    on_remove: (article: iArticle) => Promise<void>;
}

export default function ArticleList({
    title,
    items,
    on_save,
    on_remove,
}: iArticleListProps) {
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
                                    onClick={() => on_save(article)}
                                    className="text-blue-400"
                                >
                                    保存
                                </button>
                                <button
                                    onClick={() => on_remove(article)}
                                    className="text-red-400"
                                >
                                    删除
                                </button>
                            </div>
                        </div>
                        <a
                            href={article.url}
                            target="_blank"
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
