import Button from "./Button";
import FieldContainer from "./FieldContainer";

export default function Submit() {
    return (
        <FieldContainer className="flex flex-row py-2">
            <Button primary htmlType="submit">
                保存
            </Button>
        </FieldContainer>
    );
}
