
import { Button, Col, Row } from "antd"
import Image from "next/image";
import aboutUs from "@/public/images/about-us.jpg";
import { db } from "@/db";
import Link from "next/link";
import PropertyCards from "./components/PropertyCards";
import { rubik } from "@/fonts";
//import ctaImage from ".../public/images/cta.jfif";
import ctaImage from ".../public/images/cta.jfif";





export default async function Homepage() {

  const featuredProperties = await db.property.findMany({
    where: {
      isFeatured: true,
    },
    include: {
      images: true
    },
    take: 3,
  })
  console.log(featuredProperties)

  const PropertiesWithMessageCount = await db.property.findMany({
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
      images: true
    },
  })

  const onDemandProperties = PropertiesWithMessageCount.sort(
    (a, b) => b._count.messages - a._count.messages
  ).slice(0, 3)
  console.log(onDemandProperties)

  return (
    <>

      <div className="container">
        <div className="section">
          <Row gutter={[48, 32]}>
            <Col xs={24} md={12}>
              <Image src={aboutUs} alt="About Us" style={{ width: "100%", height: "auto" }} className="about-us-image expend image-shadow" />
            </Col>
            <Col xs={24} md={12} className="text-dark">
              <h1 className="heading"> About Us</h1>
              <p className="paragraph-main ">
                Easy Homes is a modern and reliable property platform created to simplify
                the process of buying, selling, and renting homes. We aim to bridge the gap
                between property seekers and property owners by offering a clean, fast, and
                user-friendly digital experience. With accurate listings, smart search features,
                and a responsive design, Easy Homes helps users discover the right property with
                confidence and ease.
              </p>

              <h1 className="title"> Our Mission</h1>
              <p className="paragraph">
                Our mission is to make property searching simple, transparent, and accessible by
                providing a fast, reliable, and user-friendly platform that helps people find the
                right home with confidence.
              </p>

              <h1 className="title"> Why Choose Us</h1>
              <p className="paragraph">
                -Simple and easy-to-use interface
                <br />
                -Verified and reliable property listings
                <br />
                -Fast and responsive performance on all devices
                <br />
                -Smart search and filter options
                <br />
                -Secure and modern platform built with the latest technologies
              </p>
            </Col>
          </Row>
        </div>
      </div>

      <div className="container section container-padding featured-properties text-dark">
        <h1 className="heading"> Featured Properties</h1>
        <p className="paragraph mb-1 text-center">
          Explore our featured properties that are currently available for sale and rent.
        </p>
        <PropertyCards layout="vertical" properties={featuredProperties} />
        <Link href={"/properties"}>
          <Button type="primary" className="view-btn" size="large"> View Properties </Button>
        </Link>
      </div>


      <div className="container section ">
        <h1 className="heading">  Properties On Demand </h1>
        <p className="paragraph mb-1 text-center">
          Check out most popular properties that are high on demand.
        </p>
        <PropertyCards layout="vertical" properties={onDemandProperties} />
      </div>

      <div className="section container-padding cta">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={16}>
            <div className="cta-container" style={{
              width: "100vw",
              height:"25vw",
              backgroundColor: "#5e23db",
              //textAlign: "center",
              padding: "60px 20px",
              
            }}
            >
              <h2 className={`${rubik.className} `} style={{
                color: "#ffffff",
                fontSize: "2rem",
                fontWeight: 700,
                lineHeight: 1.2,
                margin: 0,
              }}>
                Ready to Find Your <strong className="color-secondary">Dream Home?</strong>
              </h2>
              <p className={`cta-subtitle ${rubik.className}`} style={{ color: "#ffffff" }} >
                   We offer a wide range of properties to suit all your needs.
                   <br />
                   Whether you are looking  to buy, or rent, We are here to help You.
              </p>
              <br />
              <Link href={"/properties"}>
                <Button type="primary" size="large" className="view-btn">
                  Explore Properties
                </Button>
              </Link>
            </div>
          </Col>
          <Col xs={24} md={8}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "340px", 
          marginLeft: "-30px",         // match the CTA card height
          borderRadius: "30px",
          overflow: "hidden",       // clip image inside the card
        }}
      >
        <Image
          src="/images/cta.jfif"
          alt="CTA Image"
          fill                     // fill the parent div
          style={{ 
            objectFit: "cover",
            
           }}
        />
      </div>
    </Col>
        </Row>
      </div>

    </>
  );
}
