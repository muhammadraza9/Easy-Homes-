'use client'

import Image from "next/image";
import logo from "@/public/images/logo.png";
import { Button, Divider, Dropdown, Flex, MenuProps, Tooltip } from "antd";
import { GoogleOutlined, HeartOutlined, MessageOutlined } from "@ant-design/icons";
import SearchProperties from "./SearchProperties";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ClientSafeProvider, getProviders, LiteralUnion, signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";



export default function Header(): React.ReactElement {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [providers, setProviders] = useState<Record<
        LiteralUnion<string>,
        ClientSafeProvider
    > | null>(null)

   // console.log(session);

    useEffect(() => {
        const setAuthproviders = async () => {
            const res = await getProviders();
            setProviders(res)
        }
        setAuthproviders()
    }, [session]);

    const items: MenuProps["items"] = [
            {
            key: "profile",
            label: "Profile",
            onClick: () => {
                router.push("profile")
            }
        },

        {
            key: "saved-properties",
            label: "Saved Properties",
            onClick: () => {
                router.push("saved-properties")
            }
        },
        {
            key: "sold-properties",
            label: "Sold Properties",
            onClick: () => {
                router.push("sold-properties")
            }
        },
    
        {
            key: "logout",
            label: "logout",
            danger: true,
            onClick: () => {
                signOut()
            }
        }
    ]


    return (
        <nav className="nav">
            <div className="flex-between">
                <div className="flex-align-center" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <Link href={"/"}>
                        <Image src={logo} alt="logo" width={200} className="pointer" />
                    </Link>
                    <Link href={"/properties"}>
                        <Button ghost>Properties</Button>
                    </Link>
                </div>
                {!session && providers && (
                    <Button
                        icon={<GoogleOutlined />}
                        onClick={() => signIn(providers.google.id)}
                    >
                        Login or Register
                    </Button>
                )}
                {session && (
                    <Flex align="center" gap={22}>
                        <Tooltip title="Messages">
                        <MessageOutlined 
                             className="header-icons"
                             onClick={() => router.push("/messages")}
                             style={{ color: "white" }}
                           />
                        </Tooltip>
                        <Tooltip title="Saved Properties">
                        <HeartOutlined 
                             className="header-icons"
                             onClick={() => router.push("/saved-properties")}
                             style={{ color: "white" }}
                           />
                        </Tooltip>

                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Image
                            src={session?.user?.image as string}
                            width={40}
                            height={40}
                            alt={session?.user?.name || "user"}
                            className="profile-img"
                        />
                    </Dropdown>
                    </Flex>
                )}
            </div>
            <hr /> <Divider />
            {pathname === "/" && <div className="hero">
                <h1 className="hero-title">
                    Finding your <span className="color-secondary">Profect Home</span>
                </h1>
                <p className="text-center text-white">
                    Search for your perfect Home in the best location all around the World
                </p>
                <br />


                {/* Search Box */}
                <SearchProperties />
                <Flex justify="center" gap={8}>
                    <Link href={"/properties"}>
                        <Button type="primary"> Browse Properties </Button>
                    </Link>
                    <Link href={"/properties/add"}>
                        <Button type="primary"> List Properties </Button>
                    </Link>
                </Flex>
            </div>}
        </nav>
    );
}
