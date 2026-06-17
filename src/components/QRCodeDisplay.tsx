import { useState, useEffect } from "react";
import {
  makeStyles,
  tokens,
  shorthands,
  Text,
  Button,
} from "@fluentui/react-components";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { ChevronDownRegular, ChevronUpRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  container: {
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground1,
    padding: "12px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  qrGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "12px",
    maxHeight: "400px",
    overflowY: "auto",
  },
  qrItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    backgroundColor: tokens.colorNeutralBackground2,
  },
  qrWrapper: {
    padding: "8px",
    backgroundColor: "#ffffff",
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
  },
  linkText: {
    fontSize: "11px",
    color: tokens.colorNeutralForeground3,
    textAlign: "center",
    wordBreak: "break-all",
    maxWidth: "100%",
  },
  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  collapsed: {
    display: "none",
  },
});

interface QRCodeDisplayProps {
  links: string;
}

export function QRCodeDisplay({ links }: QRCodeDisplayProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const [linkList, setLinkList] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const parsed = links
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    setLinkList(parsed);
    if (parsed.length > 0) {
      setIsExpanded(true);
    }
  }, [links]);

  if (linkList.length === 0) {
    return null;
  }

  const downloadQRCode = (link: string, index: number) => {
    const svgElement = document.getElementById(`qr-inline-${index}`);
    if (!svgElement) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const qrSize = 512;

    img.onload = () => {
      canvas.width = qrSize;
      canvas.height = qrSize;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, qrSize, qrSize);
      ctx.drawImage(img, 0, 0, qrSize, qrSize);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `qrcode-${index + 1}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const downloadAllQRCodes = () => {
    linkList.forEach((link, index) => {
      setTimeout(() => downloadQRCode(link, index), index * 200);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text weight="semibold">
          {t("qrCodeTitle")} ({linkList.length})
        </Text>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {linkList.length > 1 && (
            <Button size="small" appearance="subtle" onClick={downloadAllQRCodes}>
              {t("downloadAllQRCodes")}
            </Button>
          )}
          <Button
            size="small"
            appearance="subtle"
            icon={isExpanded ? <ChevronUpRegular /> : <ChevronDownRegular />}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? t("collapse") : t("expand")}
          </Button>
        </div>
      </div>
      <div className={isExpanded ? styles.qrGrid : styles.collapsed}>
        {linkList.map((link, index) => (
          <div key={index} className={styles.qrItem}>
            <Text size={200} weight="semibold">
              {linkList.length > 1 ? `${t("nodeIndex", { index: index + 1 })}` : ""}
            </Text>
            <div className={styles.qrWrapper}>
              <QRCodeSVG
                id={`qr-inline-${index}`}
                value={link}
                size={120}
                level="M"
                includeMargin={false}
              />
            </div>
            <Text className={styles.linkText}>
              {link.length > 40 ? `${link.substring(0, 40)}...` : link}
            </Text>
            <Button size="small" onClick={() => downloadQRCode(link, index)}>
              {t("download")}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
