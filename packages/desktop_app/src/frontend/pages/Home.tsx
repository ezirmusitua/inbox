import Layout from "frontend/components/Layout";
import { article } from "frontend/resource";

export default function HomePage() {
    const data = article.get_today();
    console.log(data);
    return (
        <Layout>
            <section>Not implemented</section>
        </Layout>
    );
}
