import { Form, Formik } from "formik";
import { useContext } from "react";
import setting from "resource/setting";
import context, { eActionType } from "../context";
import FormField from "./FormField";
import FsPicker from "./FsPicker";
import Submit from "./Submit";
import Title from "./Title";

export default function Logseq() {
    const { state } = useContext(context);
    if (!state.setting || !state.setting.logseq) return null;
    return (
        <div>
            <Title>Logseq</Title>
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
        </div>
    );
}
