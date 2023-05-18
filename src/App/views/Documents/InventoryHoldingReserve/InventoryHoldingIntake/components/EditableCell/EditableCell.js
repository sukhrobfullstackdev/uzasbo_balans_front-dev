import React, { useState, useRef, useEffect} from 'react';
import { Form, InputNumber, Input } from 'antd';
import { useTranslation } from 'react-i18next';

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    form,
    ...restProps
    
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    // const form = useContext(EditableContext);
    const { t } = useTranslation();

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            let status = 0;
            if (record.Status === 0) {
                status = 2;
            } else if (record.Status === 1) {
                status = 1;
            }
            toggleEdit();
            handleSave({ ...record, ...values, Status: status });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable && (dataIndex === 'Sum')) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber
                    style={{ width: '100%' }} ref={inputRef}
                    onPressEnter={save} onBlur={save}
                    placeholder={t('Sum')}
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };

    if (editable && (dataIndex === 'IntakeDetails')) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input
                    style={{ width: '100%' }} ref={inputRef}
                    onPressEnter={save} onBlur={save}
                    placeholder={t('IntakeDetails')}
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };

    if (editable && (dataIndex === 'Quantity')) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber
                    style={{ width: '100%' }} ref={inputRef}
                    onPressEnter={save} onBlur={save}
                    placeholder={t('IntakeDetails')}
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };

    if (editable && (dataIndex === 'Price')) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber
                    style={{ width: '100%' }} ref={inputRef}
                    onPressEnter={save} onBlur={save}
                    placeholder={t('IntakeDetails')}
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };

    return <td {...restProps}>
        {childNode}
    </td>;
};

export default EditableCell;