'use client'

import { editProperty, getPropertyById, postProperty } from "@/app/actions";
import { Property } from "@prisma/client";
import {
    Alert,
    Button,
    Card,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Space,
    Upload,
} from "antd";
import { useSession } from "next-auth/react";
import React, { use, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { RcFile } from "antd/es/upload";
import { useMessage } from "@/app/context/AlertContext";
import { PropertyWithImagesAndOwner } from "@/db";
import dayjs from "dayjs"
import BackButton from "@/app/components/BackButton";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];



export default function EditProperty({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session } = useSession();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const { showMessage } = useMessage();
    const [propertyDetails, setPropertyDetails] = useState<PropertyWithImagesAndOwner>({} as PropertyWithImagesAndOwner)
    const [form] = Form.useForm()


    const fetchPropertiesDetails = async () => {
        try {
            const property = await getPropertyById(+id)
            console.log(property)
            if (property) {
                setPropertyDetails(property)
                const existingImages = property.images.map((img, index) => ({
                    uid: "_" + index,
                    name: `image${index + 1}.jpg`,
                    status: "done",
                    url: img.url,
                })) as UploadFile[]
                setFileList(existingImages)
            }
        } catch (error) {
            showMessage("Something went wrong", "error")
        }
    }

    useEffect(() => {
        fetchPropertiesDetails()
    }, [id]);


    useEffect(() => {
        if (propertyDetails) {
            form.setFieldsValue({ ...propertyDetails, availableFrom: dayjs(propertyDetails.availableFrom) })
        }
    }, [propertyDetails])


    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const onFinish = async (values: any) => {
        // Convert Dayjs object to ISO string for server
        const plainData = {
            ...values,
            availableFrom: values.availableFrom
                ? values.availableFrom.toISOString()
                : null,
        };

        try {
            const base64Images = await Promise.all(
                fileList.map((file) => {
                    if (file.originFileObj) {
                        // new file, convert to base64
                        return getBase64(file.originFileObj as RcFile);
                    }
                    // existing image, keep URL as-is
                    return Promise.resolve(file.url as string);
                })
            );

            const response = await editProperty(
                plainData,
                propertyDetails.id,  // use property id, not session user id
                base64Images
            );

            if (response) {
                showMessage("Property edited successfully!", "success");
                console.log(response);
            }
        } catch (error) {
            showMessage("Something went wrong!", "error");
            console.log("Error editing property", error);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handlePreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    if (session && +session?.user.id !== propertyDetails.ownerId) {
        return (
            <div className="container">
                <Alert
                    message="You are not Allowed to edit this Property"
                    type="error"
                />
            </div>
        )
    }

    return (
        <div className="formContainer">
            <h1 className="heading">Edit Property</h1>

            <div style={{ flexDirection: 'column', gap: '16px', padding: '16px' }}>
                <BackButton />
            </div>


            <Form
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12 }}
            >
                <Card>
                    {/* Form fields as in your original code */}
                    <Form.Item label="Type" name={"type"} rules={[{ required: true, message: "Please input the property type" }]}>
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value={"RENT"}>Rent</Radio.Button>
                            <Radio.Button value={"SALE"}>Sale</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Name" name={"name"} rules={[{ required: true, message: "Please input the property name" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Description" name={"description"}>
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item label="Street" name={"street"} rules={[{ required: true, message: "Please input the property street" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="City" name={"city"} rules={[{ required: true, message: "Please input the property city" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="State" name={"state"} rules={[{ required: true, message: "Please input the property state" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Zipcode" name={"zipcode"} rules={[{ required: true, message: "Please input the property zipcode" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Price" name={"price"} rules={[{ required: true, message: "Please input the property price" }]}>
                        <InputNumber addonBefore={"Rs:"}
                            formatter={(value) => value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                            parser={(value) => value ? Number(value.replace(/,/g, '')) : 0}

                        />
                    </Form.Item>

                    <Form.Item label="BHK" name={"bhk"} rules={[{ required: true, message: "Please input the property BHK" }]}>
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value="ONE_RK">1RK</Radio.Button>
                            <Radio.Button value="ONE_BHK">1BHK</Radio.Button>
                            <Radio.Button value="TWO_BHK">2BHK</Radio.Button>
                            <Radio.Button value="THREE_BHK">3BHK</Radio.Button>
                            <Radio.Button value="FOUR_BHK">4BHK</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Area" name={"area"} rules={[{ required: true, message: "Please input the property area" }]}>
                        <InputNumber addonAfter={"sqft"}
                            formatter={(value) => value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                            parser={(value) => value ? Number(value.replace(/,/g, '')) : 0}
                        />
                    </Form.Item>

                    <Form.Item label="Parking" name={"parking"} rules={[{ required: true, message: "Please input the property parking" }]}>
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value={"YES"}>Yes</Radio.Button>
                            <Radio.Button value={"NO"}>No</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Upload Images" valuePropName="fileList">
                        <Upload
                            multiple
                            listType="picture-card"
                            beforeUpload={() => false}
                            onChange={onChange}
                            onPreview={handlePreview}
                            fileList={fileList}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Preferred Tenants" name={"preferredTenants"} rules={[{ required: true }]}>
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value={"FAMILY"}>Family</Radio.Button>
                            <Radio.Button value={"BACHELOR"}>Bachelor</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Property Type" name={"propertyType"} rules={[{ required: true }]}>
                        <Radio.Group buttonStyle="solid">
                            <Radio.Button value={"APARTMENT"}>Apartment</Radio.Button>
                            <Radio.Button value={"INDEPENDENT"}>Independent</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="Available From" name={"availableFrom"} rules={[{ required: true }]}>
                        <DatePicker />
                    </Form.Item>

                    <Space>
                        <Button type="primary" htmlType="submit">Submit</Button>
                        <Button onClick={() => form.resetFields()}>Reset</Button>
                    </Space>
                </Card>
            </Form>
        </div>
    );
}
