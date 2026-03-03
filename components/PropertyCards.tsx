'use client';

import { Row, Col, Card, Tag, Carousel } from "antd";
import Image from "next/image";
import { EnvironmentOutlined, ExpandAltOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { PropertyWithImages } from "@/db";
import SaveProperty from "./SaveProperty";
import Link from "next/link";

export default function PropertyCards({
  properties,
  layout,
}: {
  properties: PropertyWithImages[];
  layout: "horizontal" | "vertical" | null;
}) {

  const router = useRouter();

  // FIXED FUNCTION
  const goToProperty = (id: string | number) => {

    if (!id) return;

    router.push(`/properties/${String(id)}`);

  };

  return (
    <>
      {layout === "vertical" ? (
        <Row gutter={[16, 16]} justify="center">

          {properties.map((property) => (

            <Col key={property.id} xs={24} md={12} lg={10}>

              <Card
                hoverable
                className="mb-1 pointer"
                style={{ maxWidth: "800px", margin: "0 auto", cursor:"pointer" }}
                onClick={() => goToProperty(property.id)}
              >

                {/* IMAGE & SAVE BUTTON */}

                <div style={{ position: "relative" }}>

                  <div
                    style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <SaveProperty property={property} />
                  </div>


                  <Carousel arrows>

                    {property.images.map((img) => (

                      <Image
                        key={img.id}
                        src={img.url}
                        alt={`${property.name} image`}
                        width={400}
                        height={250}
                        unoptimized
                        style={{ width: "100%", height: "auto" }}
                      />

                    ))}

                  </Carousel>

                  {/* <div className="p-1">
                    <Link href={`properties/${property.id}`} style={{color: "black"}}>
                    <PropertyContent property={property} />                   
                    </Link>
                  </div> */}
                </div>



                {/* DETAILS */}

                <div className="p-1">

                  <div className="card-header">

                    <p className="card-header-title" >
                      For {property.type.toUpperCase()}
                    </p>

                    <p className="card-header-price" style={{color:"blue"}}  >
                      ₹ {property.price?.toLocaleString()} 
                      {property.type === "RENT" && "/month"} 
                    </p>

                  </div>

                   <div 
                   style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '8px', 
                    marginTop: '8px' 
                  }}>

                  <Tag icon={<HomeOutlined />} color="blue">
                    {property.bhk?.split("_").join("")}
                  </Tag>
                  <Tag icon={<HomeOutlined />} color="blue">
                    {property.propertyType}
                  </Tag>


                  <Tag icon={<ExpandAltOutlined />} color="blue">
                    {property.area} sqft
                  </Tag>


                  <Tag icon={<UserOutlined />} color="blue">
                    {property.preferredTenants}
                  </Tag>

                 </div>

                  <h4 className="mt-1">
                    {property.name}
                  </h4>


                  <p className="card-dec">

                    {property.description?.slice(0, 150)}

                    {property.description &&
                     property.description.length > 150 && "..."}

                  </p>


                  <EnvironmentOutlined />

                  {property.street},
                  {property.city},
                  {property.state},
                  {property.zipcode}

                </div>

              </Card>

            </Col>

          ))}

        </Row>

      ) : (

        <>
          {properties.map((property) => (

            <Card
              key={property.id}
              hoverable
              className="mb-1 pointer"
              style={{
                maxWidth: "900px",
                margin: "0 auto 16px auto",
                cursor:"pointer"
              }}
              onClick={() => goToProperty(property.id)}
            >

              <Row gutter={[16, 16]} align="middle">


                {/* IMAGE */}

                <Col xs={24} md={12}>

                  <div style={{ position: "relative" }}>

                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 10
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SaveProperty property={property} />
                    </div>


                    <Carousel arrows>

                      {property.images.map((img) => (

                        <Image
                          key={img.id}
                          src={img.url}
                          alt={property.name}
                          width={600}
                          height={240}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "240px"
                          }}
                        />

                      ))}

                    </Carousel>

                  </div>

                </Col>


                {/* DETAILS */}

                <Col xs={24} md={12}>

                  <div className="p-1">

                    <div className="card-header">

                      <p className="card-header-title">
                        For {property.type.toUpperCase()}
                      </p>

                      <p className="card-header-price">
                        ₹ {property.price?.toLocaleString()}
                      </p>

                    </div>


                    <Tag icon={<HomeOutlined />} color="blue">
                      {property.bhk?.split("_").join("")}
                    </Tag>


                    <Tag icon={<ExpandAltOutlined />} color="blue">
                      {property.area} sqft
                    </Tag>


                    <Tag icon={<UserOutlined />} color="blue">
                      {property.preferredTenants}
                    </Tag>


                    <h4 className="mt-1">
                      {property.name}
                    </h4>


                    <p className="card-dec">

                      {property.description?.slice(0, 150)}

                      {property.description &&
                       property.description.length > 150 && "..."}

                    </p>


                    <EnvironmentOutlined />

                    {property.street},
                    {property.city},
                    {property.state},
                    {property.zipcode}

                  </div>

                </Col>

              </Row>

            </Card>

          ))}
        </>
      )}
    </>
  );
}