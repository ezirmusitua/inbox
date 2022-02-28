import { Field, Form, Formik } from "formik";
import { useContext } from "react";
import { put } from "resource/fetch";
import setting from "resource/setting";
import context, { eActionType } from "../context";
import FormField from "./FormField";
import FsPicker from "./FsPicker";
import Submit from "./Submit";
import Title from "./Title";

export default function Backend() {
    const { state, dispatch } = useContext(context);
    if (!state.setting || !state.setting.backend) return null;

    return (
        <div className="pb-4">
            <Title>服务设置</Title>
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
        </div>
    );
}
