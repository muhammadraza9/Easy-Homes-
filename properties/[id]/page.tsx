// app/properties/[id]/page.tsx
import { getProperties, getPropertyById } from "@/app/actions";
import { Breadcrumb, Card, Carousel, Row, Col, Divider, Descriptions } from "antd";
import Image from "next/image";
import { KeyOutlined, HomeOutlined, LayoutOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import Contact from "@/app/components/Contact";
import Map from "@/app/components/Map";
import BackButton from "@/app/components/BackButton";
import FloatIcons from "@/app/components/FloatIcons";
import { title } from "process";

interface Props {
  params: { id: string | number };
}

export async function generateStaticParams() {
        const properties = await getProperties()
        return properties.map((p) =>({
          id: p.id,
        }))
}


export async function generateMetadata({params} : {params: {id: string}}){
        const property = await getPropertyById(params.id)
          return {
            title: `${property?.name} | EASY HOMES `,
            description: property?.description,
          }
}


export default async function PropertyPage({ params }: Props) {
  // unwrap params
  const { id } = await params;  // ✅ await params
  const property = await getPropertyById(Number(id));

  if (!property) return <p>Property not found</p>;

  return (
    <div className="container">
      <h1 style={{ display: "flex", justifyContent: "center" }}>Property Details</h1>

      <div style={{ flexDirection: 'column', gap: '16px', padding: '16px' }}>
        <BackButton />
      </div>


      <Breadcrumb style={{ margin: "16px 0", display: "flex", justifyContent: "center" }}
        items={[
          { title: "Home", href: "/" },
          { title: "Properties", href: "/properties" },
          { title: "Property Details" },
        ]}
      />

      {property.images.length > 0 && (
        <Carousel autoplay>
          {property.images.map((img) => (
            <div key={img.id}>
              <Image
                src={img.url}
                alt={property.name}
                width={600}
                height={400}
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
              />
            </div>
          ))}
        </Carousel>
      )}

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={16}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
              <h2>{property.name}</h2>
              <h3 style={{ color: "#1677ff" }}>
                ₹ {property.price?.toLocaleString()}
                {property.type === "RENT" && "/month"}
                </h3>
            </div>
            <p>
              {property.street}, {property.city}, {property.state}, {property.zipcode}
            </p>

            <Card style={{ marginTop: 16, color: "#1677ff" }}>
              <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                <div><KeyOutlined /> {property.type}</div>
                <Divider type="vertical" style={{ height: 24, borderLeft: "1px solid #080808" }} />
                <div><HomeOutlined /> {property.propertyType}</div>
                <Divider type="vertical" style={{ height: 24, borderLeft: "1px solid #080808" }} />
                <div><LayoutOutlined /> {property.area} sqft</div>
                <Divider type="vertical" style={{ height: 24, borderLeft: "1px solid #080808" }} />
                <div><UsergroupAddOutlined /> {property.preferredTenants}</div>
              </div>
            </Card>

            <Card style={{ marginTop: 16 }}>
              <h3>Description</h3>
              <p>{property.description}</p>
            </Card>
          </Card>

          <Map address={`${property.street}, ${property.city}, ${property.state}, ${property.zipcode}`} />

        </Col>

        <Col xs={24} md={8}>
          <Contact property={property} />
        </Col>
      </Row>
      {property && <FloatIcons property={property} />}
    </div>
  );
}