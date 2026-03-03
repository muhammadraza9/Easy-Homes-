'use client'

import React, { useEffect, useState } from "react";
import { Row, Col, Form, Select, Breadcrumb, Card, Radio, Checkbox, Divider, Button } from "antd";
import { getProperties } from "../actions"; // frontend fetch now calls API
import { PropertyWithImages } from "@/db";
import PropertyCards from "@/app/components/PropertyCards";
import { FilterValues } from "@/types";
import { LoadingOutlined } from "@ant-design/icons";
import { useMessage } from "../context/AlertContext";
import BackButton from "../components/BackButton";



export default function PropertiesPage() {
  const [sortOrder, setSortOrder] = useState<"latest" | "asc" | "desc">("latest");
  const [properties, setProperties] = useState<PropertyWithImages[]>([]);
  const [filters, setFilters] = useState<FilterValues>({});
  const [propertyCount, setPropertyCount] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [filterForm] = Form.useForm();
  const { showMessage } = useMessage();

  useEffect(() => {
    showMessage("Properties page", "success");

    const fetchProperties = async () => {
      try {
        setLoading(true);

        // ✅ Ensure sortOrder is typed
        const data = await getProperties(filters, sortOrder as "latest" | "asc" | "desc", propertyCount);

        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, sortOrder, propertyCount]);

  return (
    <div className="container">
      <h1 className="heading">Properties</h1>

      <Breadcrumb className="flex-center"
        items={[
          { title: "Home", href: "/" },
          { title: "Properties", href: "/properties" },
        ]}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} className="sticky-column">

          <div style={{ flexDirection: 'column', gap: '16px', padding: '16px' }}>
            <BackButton />
          </div>

          <Card title="Filters">
            <Form form={filterForm} onFinish={(values) => setFilters({ ...values })}>
              <Form.Item name={"type"}>
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value={"RENT"}>Rent</Radio.Button>
                  <Radio.Button value={"SALE"}>Sale</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item name={"apartment_type"}>
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value={"APARTMENT"}>Apartment</Radio.Button>
                  <Radio.Button value={"INDEPENDENT"}>Independent</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="bhk">
                <Checkbox.Group
                  options={[
                    { label: "1RK", value: "ONE_RK" },
                    { label: "2BHK", value: "TWO_RK" },
                    { label: "3BHK", value: "THREE_RK" },
                    { label: "4BHK", value: "FOUR_RK" },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Price" name={'price'}>
                <Select className="w-full" placeholder="Select price range" options={[
                  { label: "10,000 - 20,000", value: "10000-20000" },
                  { label: "20,000 - 30,000", value: "20000-30000" },
                  { label: "30,000 - 40,000", value: "30000-40000" },
                  { label: "40,000 - 50,000", value: "40000-50000" },
                  { label: "50,000 - 1lac", value: "50000-100000" },
                  { label: "1lac - 5lac", value: "100000-500000" },
                  { label: "5lac - 10lac", value: "500000-1000000" },
                  { label: "10lac - 20lac", value: "1000000-2000000" },
                  { label: "20lac - 50lac", value: "2000000-5000000" },
                  { label: "50lac - 1cr", value: "5000000-10000000" },
                  { label: "1cr - 5cr", value: "10000000-50000000" },
                  { label: "5cr - 10cr", value: "50000000-100000000" },
                ]} />
              </Form.Item>

              <Form.Item label="Area" name={"area"}>
                <Select className="w-full" placeholder="Select area range" options={[
                  { label: "0 - 500", value: "0-500" },
                  { label: "500 - 1000", value: "500-1000" },
                  { label: "1000 - 1500", value: "1000-1500" },
                  { label: "1500 - 2000", value: "1500-2000" },
                  { label: "2000 - 2500", value: "2000-2500" },
                ]} />
              </Form.Item>

              <Form.Item name={"preferred_tenants"}>
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value={"FAMILY"}>Family</Radio.Button>
                  <Radio.Button value={"BACHELOR"}>Bachelor</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Divider />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={() => filterForm.resetFields()}>Reset</Button>
                <Button type="primary" htmlType="submit">Apply</Button>
              </div>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={16} className="scrollable-column">
          <Form.Item label="Sort By" name={"sort_by"} className="mb-1">
            <Select
              style={{ width: 200 }}
              defaultValue="latest"
              onChange={(value: string) => setSortOrder(value as "latest" | "asc" | "desc")}
              options={[
                { label: "Latest", value: "latest" },
                { label: "Price: Low to High", value: "asc" },
                { label: "Price: High to Low", value: "desc" },
              ]}
            />
          </Form.Item>

          <PropertyCards layout={"horizontal"} properties={properties} />
          {loading && <LoadingOutlined className="loading" />}

          <Button
            type="primary"
            block
            className="mt-1"
            onClick={() => setPropertyCount((prev) => prev + 5)}
          >
            Load More
          </Button>
        </Col>
      </Row>
    </div>
  );
}