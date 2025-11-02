import React from "react";
import blogHeaderImage from "@site/static/img/banner.png";

export default function BlogHeader(): JSX.Element {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "300px",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    backgroundImage: `url(${blogHeaderImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
            >
            </div>
        </div>
    );
}
