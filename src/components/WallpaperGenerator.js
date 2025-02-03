// components/WallpaperGenerator.js
"use client";

import { useState } from "react";
import { SketchPicker } from "react-color";
import html2canvas from "html2canvas";
import { useFormattedDate } from "../utils/useFormattedDate";

const WallpaperGenerator = () => {
  const [backgroundColor, setBackgroundColor] = useState("#343436");
  const [width, setWidth] = useState(2880);
  const [height, setHeight] = useState(1800);
  const [scale, setScale] = useState(2);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState("macbookair13");
  const [selectedSize, setSelectedSize] = useState("1440x900 @2x");
  const [deviceFrame, setDeviceFrame] = useState("macbook");
  const [color, setColor] = useState("#ffffff");
  const formattedDate = useFormattedDate();

  // Predefined screen resolutions categorized by device type
  const screenSizes = {
    macbookair13: [
      { label: "1440x900 @2x", width: 2880, height: 1800, scale: 2 },
      { label: "1024x640 @2x", width: 2048, height: 1280, scale: 2 },
      { label: "1280x800 @2x", width: 2560, height: 1600, scale: 2 },
      { label: "1680x1050 @2x", width: 3360, height: 2100, scale: 2 },
    ],
    macbookair13notch: [
      { label: "1470x956 @2x", width: 2940, height: 1912, scale: 2 },
      { label: "1024x666 @2x", width: 2048, height: 1332, scale: 2 },
      { label: "1280x832 @2x", width: 2560, height: 1664, scale: 2 },
      { label: "1710x1112 @2x", width: 3420, height: 2224, scale: 2 },
      { label: "2560x1664", width: 2560, height: 1664, scale: 1 },
    ],
    macbookpro14notch: [
      { label: "1512x982 @2x", width: 3024, height: 1964, scale: 2 },
      { label: "1024x665 @2x", width: 2048, height: 1330, scale: 2 },
      { label: "1147x745 @2x", width: 2294, height: 1490, scale: 2 },
      { label: "1352x878 @2x", width: 2704, height: 1756, scale: 2 },
      { label: "1800x1169 @2x", width: 3600, height: 2338, scale: 2 },
    ],
    macbookpro16notch: [
      { label: "1728x1117 @2x", width: 3456, height: 2234, scale: 2 },
      { label: "1496x967 @2x", width: 2992, height: 1934, scale: 2 },
      { label: "2056x1334 @2x", width: 4112, height: 2668, scale: 2 },
      { label: "2232x1488 @2x", width: 4464, height: 2976, scale: 2 },
      { label: "2584x1672 @2x", width: 5168, height: 3344, scale: 2 },
    ],
    imac21: [
      { label: "2048x1152 @2x", width: 4096, height: 2304, scale: 2 },
      { label: "2304x1296 @2x", width: 4608, height: 2592, scale: 2 },
      { label: "2560x1440 @2x", width: 5120, height: 2880, scale: 2 },
      { label: "4096x2304", width: 4096, height: 2304, scale: 1 },
    ],
    imac24: [
      { label: "2240x1260 @2x", width: 4480, height: 2520, scale: 2 },
      { label: "1920x1080 @2x", width: 3840, height: 2160, scale: 2 },
      { label: "2560x1440 @2x", width: 5120, height: 2880, scale: 2 },
      { label: "2880x1620 @2x", width: 5760, height: 3240, scale: 2 },
      { label: "3200x1800 @2x", width: 6400, height: 3600, scale: 2 },
    ],
    imac27: [
      { label: "2560x1440 @2x", width: 5120, height: 2880, scale: 2 },
      { label: "2048x1152 @2x", width: 4096, height: 2304, scale: 2 },
      { label: "2880x1620 @2x", width: 5760, height: 3240, scale: 2 },
      { label: "3200x1800 @2x", width: 6400, height: 3600, scale: 2 },
    ],
    external: [
      { label: "1920x1080 @2x", width: 3840, height: 2160, scale: 2 },
      { label: "2560x1440 @2x", width: 5120, height: 2880, scale: 2 },
      { label: "3008x1692 @2x", width: 6016, height: 3384, scale: 2 },
      { label: "3360x1890 @2x", width: 6720, height: 3780, scale: 2 },
      { label: "3840x2160", width: 3840, height: 2160, scale: 1 },
    ],
    nonretina: [
      { label: "1920x1080", width: 1920, height: 1080, scale: 1 },
      { label: "2560x1440", width: 2560, height: 1440, scale: 1 },
      { label: "3440x1440", width: 3440, height: 1440, scale: 1 },
    ],
  };

  // Handle color change
  const handleColorChange = (color) => {
    setBackgroundColor(color.hex);
    setColor(color.hex);
  };

  const svgFillColor = color === "#ffffff" ? "#000000" : "#ffffff";

  // Handle device type change
  const handleDeviceChange = (e) => {
    const device = e.target.value;
    setSelectedDevice(device);

    switch (device) {
      case "macbookair13":
        setDeviceFrame("macbook");
        break;
      case "macbookair13notch":
      case "macbookpro14notch":
      case "macbookpro16notch":
        setDeviceFrame("macbook_notch");
        break;
      case "imac21":
      case "imac27":
        setDeviceFrame("imac");
        break;
      case "imac24":
        setDeviceFrame("imac24");
        break;
      case "nonretina":
        setDeviceFrame("external_monitor");
        break;
      case "external":
        setDeviceFrame("external_monitor");
        break;
      default:
        setDeviceFrame("macbook_notch");
    }

    // Reset to the first size for the selected device
    const firstSize = screenSizes[device][0].label;
    setSelectedSize(firstSize);
    const selectedSizeObj = screenSizes[device].find(
      (size) => size.label === firstSize
    );
    if (selectedSizeObj) {
      setWidth(selectedSizeObj.width);
      setHeight(selectedSizeObj.height);
      setScale(selectedSizeObj.scale);
    }
  };

  // Handle screen size change
  const handleSizeChange = (e) => {
    const sizeLabel = e.target.value;
    setSelectedSize(sizeLabel);
    const selectedSizeObj = screenSizes[selectedDevice].find(
      (size) => size.label === sizeLabel
    );
    if (selectedSizeObj) {
      setWidth(selectedSizeObj.width);
      setHeight(selectedSizeObj.height);
      setScale(selectedSizeObj.scale);
    }
  };

  // Handle download as PNG
  const handleDownload = () => {
    const tempElement = document.createElement("div");
    tempElement.style.width = `${width}px`;
    tempElement.style.height = `${height}px`;
    tempElement.style.backgroundColor = "#000";
    tempElement.style.position = "absolute";
    tempElement.style.top = "-9999px";
    tempElement.style.display = "flex";
    tempElement.style.justifyContent = "center";
    tempElement.style.alignItems = "flex-end";

    const container = document.createElement("div");
    container.style.width = "100%";
    if (
      selectedDevice === "macbookair13notch" ||
      selectedDevice === "macbookpro14notch" ||
      selectedDevice === "macbookpro15notch"
    ) {
      container.style.height = `calc(100% - 37px * ${scale})`;
    } else {
      container.style.height = `calc(100% - 24px * ${scale})`;
    }
    container.style.backgroundColor = backgroundColor;
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.borderRadius = `calc(11px * ${scale})`;
    tempElement.appendChild(container);

    document.body.appendChild(tempElement);

    // Fix scaling issue on high DPI screens
    html2canvas(tempElement, {
      scale: window.devicePixelRatio,
    })
      .then((canvas) => {
        const scaledCanvas = document.createElement("canvas");
        scaledCanvas.width = canvas.width / window.devicePixelRatio;
        scaledCanvas.height = canvas.height / window.devicePixelRatio;

        const ctx = scaledCanvas.getContext("2d");
        ctx.scale(1 / window.devicePixelRatio, 1 / window.devicePixelRatio);
        ctx.drawImage(canvas, 0, 0);

        const link = document.createElement("a");
        link.download = `wallpaper_${selectedSize.replace(/\s+/g, "")}.png`;
        link.href = scaledCanvas.toDataURL("image/png");
        link.click();

        document.body.removeChild(tempElement);
      })
      .catch((error) => {
        console.error("Error capturing the canvas:", error);
      });
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <header className="row">
        <div className="col full header">
          <svg
            className="icon"
            width="96"
            height="96"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="95"
              height="95"
              rx="7"
              fill="black"
              stroke="#262626"
            />
            <rect
              x="6"
              y="36"
              width="84"
              height="54"
              rx="6"
              fill={backgroundColor}
            />
            <path
              d="M22.7876 14.3042C22.8991 14.3042 23.0715 14.3175 23.305 14.344C23.5437 14.3652 23.8143 14.4236 24.1167 14.5191C24.4192 14.6146 24.7269 14.7684 25.0399 14.9807C25.353 15.1929 25.6421 15.49 25.9074 15.872C25.8809 15.8879 25.7801 15.9596 25.605 16.0869C25.4352 16.2142 25.2415 16.3999 25.024 16.644C24.8065 16.8828 24.6155 17.1878 24.451 17.5592C24.2918 17.9253 24.2122 18.3631 24.2122 18.8724C24.2122 19.456 24.313 19.9495 24.5147 20.3527C24.7216 20.7559 24.9603 21.0822 25.2309 21.3316C25.5068 21.581 25.7509 21.764 25.9631 21.8807C26.1806 21.9922 26.2974 22.0505 26.3133 22.0558C26.308 22.0771 26.2682 22.1964 26.1939 22.414C26.1196 22.6262 26.0029 22.9021 25.8437 23.2417C25.6899 23.5759 25.4883 23.9261 25.2389 24.2922C25.0107 24.6158 24.7746 24.9262 24.5306 25.2233C24.2918 25.5205 24.0292 25.7619 23.7427 25.9476C23.4615 26.1386 23.1431 26.2341 22.7876 26.2341C22.5171 26.2341 22.2863 26.2022 22.0953 26.1386C21.9042 26.0749 21.7212 26.0006 21.5461 25.9157C21.3763 25.8362 21.188 25.7645 20.9811 25.7009C20.7741 25.6372 20.5168 25.6054 20.2091 25.6054C19.8058 25.6054 19.4689 25.6584 19.1983 25.7645C18.933 25.8759 18.681 25.9847 18.4423 26.0908C18.2035 26.1969 17.9223 26.25 17.5987 26.25C17.1052 26.25 16.6702 26.0537 16.2935 25.6611C15.9221 25.2684 15.54 24.7989 15.1474 24.2524C14.845 23.8173 14.5691 23.3159 14.3197 22.7482C14.0704 22.1805 13.8714 21.5783 13.7228 20.9416C13.5743 20.305 13.5 19.6683 13.5 19.0316C13.5 18.0129 13.6937 17.156 14.081 16.461C14.4683 15.7659 14.9644 15.2407 15.5692 14.8852C16.1741 14.5297 16.8028 14.3519 17.4554 14.3519C17.8003 14.3519 18.1239 14.4077 18.4264 14.5191C18.7341 14.6305 19.0206 14.7446 19.2859 14.8613C19.5512 14.9727 19.7926 15.0284 20.0101 15.0284C20.217 15.0284 20.4611 14.9701 20.7423 14.8533C21.0235 14.7313 21.3339 14.6093 21.6734 14.4872C22.0183 14.3652 22.3897 14.3042 22.7876 14.3042ZM22.2305 13.0149C21.9653 13.3386 21.631 13.6065 21.2278 13.8187C20.8298 14.031 20.4531 14.1371 20.0977 14.1371C20.0234 14.1371 19.9517 14.1291 19.8828 14.1132C19.8775 14.092 19.8695 14.0548 19.8589 14.0018C19.8536 13.9487 19.8509 13.8903 19.8509 13.8267C19.8509 13.4234 19.9385 13.0308 20.1136 12.6488C20.2887 12.2668 20.4903 11.9485 20.7184 11.6938C20.9996 11.3595 21.3551 11.081 21.7849 10.8581C22.2199 10.6353 22.6364 10.5159 23.0344 10.5C23.0503 10.5902 23.0582 10.6937 23.0582 10.8104C23.0582 11.2189 22.9813 11.6169 22.8274 12.0042C22.6736 12.3862 22.4746 12.7231 22.2305 13.0149Z"
              fill="white"
            />
            <g fill={svgFillColor}>
              <path d="M35 50H40V59H35V50Z" />
              <path d="M56 50H61V59H56V50Z" />
              <path d="M28 71V76L68 76V71L28 71Z" />
            </g>
          </svg>
          <h1 className="">macOS Boring Wallpaper</h1>
          <p className="description">Plain color. Nothing fancy.</p>
        </div>
      </header>
      <div className="row">
        <div className="col full mockup">
          <div className="device">
            <div className="macos-screen">
              <div className="macos-menubar">
                <div className="left">
                  <svg
                    className="apple-logo"
                    width="13"
                    height="16"
                    viewBox="0 0 13 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.28813 3.80439C9.39956 3.80439 9.57201 3.81766 9.80547 3.84419C10.0442 3.86541 10.3148 3.92378 10.6173 4.01929C10.9197 4.11479 11.2275 4.26867 11.5405 4.48091C11.8536 4.69315 12.1428 4.99028 12.4081 5.37231C12.3815 5.38823 12.2807 5.45986 12.1056 5.58721C11.9358 5.71455 11.7422 5.90026 11.5246 6.14434C11.3071 6.38311 11.116 6.6882 10.9516 7.05962C10.7924 7.42573 10.7128 7.86348 10.7128 8.37285C10.7128 8.95651 10.8136 9.44997 11.0152 9.85322C11.2222 10.2565 11.4609 10.5828 11.7315 10.8322C12.0075 11.0816 12.2515 11.2646 12.4638 11.3813C12.6813 11.4928 12.798 11.5511 12.814 11.5564C12.8087 11.5777 12.7689 11.6971 12.6946 11.9146C12.6203 12.1268 12.5036 12.4028 12.3444 12.7423C12.1905 13.0766 11.9889 13.4268 11.7395 13.7929C11.5113 14.1166 11.2752 14.427 11.0312 14.7241C10.7924 15.0213 10.5297 15.2627 10.2432 15.4484C9.962 15.6394 9.64364 15.7349 9.28813 15.7349C9.01753 15.7349 8.78672 15.7031 8.5957 15.6394C8.40469 15.5757 8.22163 15.5014 8.04653 15.4166C7.87674 15.337 7.68838 15.2653 7.48145 15.2017C7.27451 15.138 7.01717 15.1062 6.70942 15.1062C6.30617 15.1062 5.96924 15.1592 5.69863 15.2653C5.43333 15.3768 5.1813 15.4855 4.94253 15.5916C4.70376 15.6978 4.42254 15.7508 4.09888 15.7508C3.60542 15.7508 3.17033 15.5545 2.7936 15.1619C2.42218 14.7692 2.04015 14.2996 1.64751 13.7531C1.34507 13.318 1.06916 12.8166 0.819775 12.2489C0.570394 11.6811 0.371419 11.0789 0.222852 10.4422C0.0742839 9.80547 0 9.16875 0 8.53203C0 7.51328 0.193669 6.65636 0.581006 5.96128C0.968343 5.26619 1.46445 4.7409 2.06934 4.3854C2.67422 4.0299 3.30298 3.85215 3.95562 3.85215C4.3005 3.85215 4.62417 3.90786 4.92661 4.01929C5.23436 4.13071 5.52088 4.24479 5.78618 4.36152C6.05148 4.47295 6.2929 4.52866 6.51045 4.52866C6.71738 4.52866 6.96146 4.4703 7.24268 4.35356C7.52389 4.23153 7.83429 4.10949 8.17388 3.98745C8.51877 3.86541 8.89019 3.80439 9.28813 3.80439ZM8.73101 2.51504C8.46571 2.8387 8.13143 3.10666 7.72817 3.3189C7.33022 3.53114 6.9535 3.63726 6.598 3.63726C6.52371 3.63726 6.45208 3.6293 6.38311 3.61338C6.3778 3.59216 6.36984 3.55501 6.35923 3.50195C6.35392 3.44889 6.35127 3.39053 6.35127 3.32686C6.35127 2.9236 6.43882 2.53096 6.61392 2.14893C6.78901 1.76689 6.99064 1.44854 7.2188 1.19385C7.50002 0.85957 7.85552 0.581006 8.2853 0.358154C8.72039 0.135303 9.13691 0.015918 9.53486 0C9.55078 0.0902018 9.55874 0.193669 9.55874 0.3104C9.55874 0.718962 9.4818 1.11691 9.32793 1.50425C9.17406 1.88628 8.97508 2.22321 8.73101 2.51504Z"
                      fill="white"
                    />
                  </svg>
                  <div className="menu">
                    <span>Finder</span>
                    <span>File</span>
                    <span>Edit</span>
                    <span>View</span>
                    <span>Go</span>
                    <span>Windows</span>
                    <span>Help</span>
                  </div>
                </div>
                <div className="right">
                  <span>{formattedDate}</span>
                </div>
              </div>
              <div
                className="macos-wallpaper"
                style={{
                  backgroundColor: backgroundColor,
                }}
              ></div>
            </div>
            <svg width="100%" height="100%">
              <use href={`/device_frames.svg#${deviceFrame}`} />
            </svg>
          </div>
          <div className="config">
            <div className="config-wrapper">
              <div className="config-container">
                <div className="config-row">
                  <label>
                    <span>Pick color</span>
                    <div
                      className="color-picker"
                      onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                      style={{ background: backgroundColor }}
                    ></div>
                    {isColorPickerOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "40px",
                          right: "40px",
                          zIndex: 1000,
                          marginTop: "10px",
                          borderRadius: "5px",
                          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                          background: "#fff",
                        }}
                      >
                        <div
                          className="color-picker-close"
                          onClick={() =>
                            setIsColorPickerOpen(!isColorPickerOpen)
                          }
                        >
                          <svg
                            width="6"
                            height="6"
                            viewBox="0 0 6 6"
                            fill="none"
                          >
                            <path d="M5.94449 5.76234C6.25162 5.45521 6.25162 4.93641 5.95694 4.63758L4.31752 2.994L5.95694 1.35873C6.25162 1.0599 6.25162 0.536943 5.94449 0.229811C5.63321 -0.0814721 5.1144 -0.0773217 4.81557 0.217359L3.17615 1.85263L1.53258 0.213209C1.25035 -0.0690208 0.710791 -0.0856226 0.403659 0.22566C0.0965262 0.532793 0.108978 1.07235 0.391207 1.35458L2.03478 2.994L0.391207 4.64173C0.108978 4.92396 0.0965262 5.45936 0.403659 5.76649C0.710791 6.07778 1.25035 6.06533 1.53258 5.77895L3.17615 4.13537L4.81557 5.77479C5.1144 6.07363 5.63321 6.07363 5.94449 5.76234Z" />
                          </svg>
                        </div>
                        <SketchPicker
                          disableAlpha={true}
                          presetColors={[
                            "#0E0E0E",
                            "#343436",
                            "#626263",
                            "#8f8f90",
                            "#bdbdbd",
                            "#eaeaea",
                          ]}
                          color={backgroundColor}
                          onChange={handleColorChange}
                        />
                      </div>
                    )}
                  </label>
                </div>
                <div className="config-row">
                  <label>
                    <span>Select device</span>
                    <div className="form-select">
                      <select
                        value={selectedDevice}
                        onChange={handleDeviceChange}
                      >
                        <option value="macbookair13">Macbook Air 13"</option>
                        <option value="macbookair13notch">
                          Macbook Air 13" Notch
                        </option>
                        <option value="macbookpro14notch">
                          Macbook Pro 14" Notch
                        </option>
                        <option value="imac21">iMac 21" 4K</option>
                        <option value="imac24">iMac 24" 4.5K</option>
                        <option value="imac27">iMac 27" 5K</option>
                        <option value="external">External 27" 4K</option>
                        <option value="nonretina">Non Retina</option>
                      </select>
                    </div>
                  </label>
                </div>
                <div className="config-row">
                  <label>
                    <span>Select resolution</span>
                    <div className="form-select">
                      <select value={selectedSize} onChange={handleSizeChange}>
                        {screenSizes[selectedDevice].map((size) => (
                          <option key={size.label} value={size.label}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
              </div>
              <button className="button" onClick={handleDownload}>
                Download wallpaper
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer>
        Built out of boredom by{" "}
        <a href="https://jalal.works/" target="_blank">
          Jalal
        </a>
        . Inspired by{" "}
        <a href="https://topnotch.app/" target="_blank">
          TopNotch
        </a>
        .
      </footer>
    </div>
  );
};

export default WallpaperGenerator;
