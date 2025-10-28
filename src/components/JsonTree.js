import React, { useRef, useEffect, useState, useMemo } from "react";
import Tree from "react-d3-tree";

// --- Utility: Build recursive JSON tree structure
const buildNode = (value, key = "$", path = "$") => {
  if (value === null || typeof value !== "object") {
    const display =
      typeof value === "string" ? value.replace(/"/g, "") : String(value);
    return { name: key, __path: path, isLeaf: true, value: display };
  }

  if (Array.isArray(value)) {
    return {
      name: key,
      __path: path,
      isArray: true,
      children: value.map((item, i) =>
        buildNode(item, String(i), `${path}.${i}`)
      ),
    };
  }

  return {
    name: key,
    __path: path,
    children: Object.entries(value).map(([k, v]) =>
      buildNode(v, k, `${path}.${k}`)
    ),
  };
};

// --- Utility: Draw custom tree node box
const renderNode = (nodeDatum, highlightPath) => {
  const isLeaf = nodeDatum.isLeaf;
  const isArray = nodeDatum.isArray;
  const label =
    isLeaf && nodeDatum.value !== undefined
      ? nodeDatum.value
      : nodeDatum.name;

  const bg = isLeaf
    ? "#FACC15"
    : isArray
    ? "#34D399"
    : "#6366F1";
  const stroke =
    nodeDatum.__path === highlightPath ? "#EF4444" : "#1f2937";

  const width = Math.min(220, Math.max(70, (label || "").length * 8 + 20));
  const height = 36;

  return (
    <g>
      <rect
        x={-width / 2}
        y={-height / 2}
        rx={10}
        width={width}
        height={height}
        fill={bg}
        stroke={stroke}
        strokeWidth={nodeDatum.__path === highlightPath ? 3 : 1}
      />
      <text
        fill={isLeaf ? "#111827" : "#fff"}
        x={0}
        y={6}
        textAnchor="middle"
        style={{ fontSize: 12, fontFamily: "Inter, Arial" }}
      >
        {label}
      </text>
    </g>
  );
};

// --- Component
export default function JsonTree({ data, highlightPath = null }) {
  const containerRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 300, y: 50 });

  const treeData = useMemo(() => {
    if (!data) return null;
    if (typeof data === "object" && !Array.isArray(data)) {
      const keys = Object.keys(data);
      if (keys.length === 1) {
        const k = keys[0];
        return buildNode(data[k], k, `$.${k}`);
      }
    }
    return buildNode(data, "$", "$");
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: Math.max(40, height / 6) });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!treeData) {
    return (
      <div className="h-[600px] flex items-center justify-center text-gray-400">
        No data to visualize
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: "100%", height: "600px" }}>
      <Tree
        data={treeData}
        translate={translate}
        orientation="vertical"
        pathFunc="elbow"
        collapsible={false}
        nodeSize={{ x: 220, y: 120 }}
        separation={{ siblings: 1.1, nonSiblings: 1.4 }}
        renderCustomNodeElement={({ nodeDatum }) =>
          renderNode(nodeDatum, highlightPath)
        }
      />
    </div>
  );
}
