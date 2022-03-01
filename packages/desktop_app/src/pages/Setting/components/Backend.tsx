import { Form, Formik } from "formik";
import { useContext } from "react";
import setting from "resource/setting";
import context from "../context";
import FormField from "./FormField";
import FsPicker from "./FsPicker";
import Section from "./Section";
import Submit from "./Submit";

export default function Backend() {
    const { state } = useContext(context);
    if (!state.setting || !state.setting.backend) return null;

    return (
        <Section title="服务设置">
            <Formik
                initialValues={{ ...state.setting.backend }}
                onSubmit={(values) => setting.update_backend_setting(values)}
            >
                <Form className="flex flex-col">
                    <FormField
                        id="backend_port"
                        name="port"
                        label="端口"
                    ></FormField>
                    <FormField
                        id="backend_browser_bin"
                        name="browser_bin"
                        label="浏览器路径"
                        as={FsPicker}
                    ></FormField>
                    <Submit></Submit>
                </Form>
            </Formik>
        </Section>
    );
}
