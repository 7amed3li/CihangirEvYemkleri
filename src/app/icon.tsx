import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "#F6F1E7",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          border: "2px solid #354D37",
          color: "#354D37",
          fontWeight: 900,
        }}
      >
        C
      </div>
    ),
    {
      ...size,
    }
  );
}
