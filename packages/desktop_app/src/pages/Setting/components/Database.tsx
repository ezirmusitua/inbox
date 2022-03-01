import article from "resource/article";
import Button from "./Button";
import FieldContainer from "./FieldContainer";
import Section from "./Section";

export default function Database() {
    return (
        <Section title="数据">
            <FieldContainer>
                <Button danger onClick={() => article.rebuild_database()}>
                    重建数据库
                </Button>
            </FieldContainer>
        </Section>
    );
}
