import { Form, Formik } from "formik";
import { useContext } from "react";
import setting from "resource/setting";
import context from "../context";
import FormField from "./FormField";
import FsPicker from "./FsPicker";
import Section from "./Section";
import Submit from "./Submit";

export default function Logseq() {
    const { state } = useContext(context);
    if (!state.setting || !state.setting.logseq) return null;
    return (
        <Section title="Logseq">
            <Formik
                initialValues={{ ...state.setting.logseq }}
                onSubmit={(values) => setting.update_logseq_setting(values)}
            >
                <Form className="flex flex-col">
                    <FormField
                        id="logseq_root"
                        name="root"
                        label="存储库位置"
                        as={FsPicker}
                    ></FormField>
                    <Submit></Submit>
                </Form>
            </Formik>
        </Section>
    );
}
