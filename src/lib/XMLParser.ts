
/**
 * XML Parser utility for parsing Polyboard XML files
 * This will extract material lists, dimensions and perform calculations
 */

export interface XMLPart {
  id: string;
  name: string;
  material: string;
  thickness: number;
  length: number;
  width: number;
  quantity: number;
  edgeBanding?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
}

export interface XMLProject {
  name: string;
  parts: XMLPart[];
  totalArea: number; // in m²
  totalLength: number; // edgebanding length in mm
}

/**
 * Parse Polyboard XML file to extract parts and dimensions
 * @param xmlContent The XML content as string
 * @returns Parsed project data
 */
export const parsePolyboardXML = (xmlContent: string): XMLProject | null => {
  try {
    // This is a placeholder for the actual XML parsing logic
    // In a real implementation, we would use a proper XML parser library
    
    console.log("Parsing XML content", xmlContent.substring(0, 100) + "...");
    
    // For now, we'll return a mock project
    const mockProject: XMLProject = {
      name: "Mock Cabinet",
      parts: [
        {
          id: "part1",
          name: "Side Left",
          material: "PAL Alb",
          thickness: 18,
          length: 800,
          width: 600,
          quantity: 1,
          edgeBanding: {
            top: true,
            right: false,
            bottom: true,
            left: true
          }
        },
        {
          id: "part2",
          name: "Side Right",
          material: "PAL Alb",
          thickness: 18,
          length: 800,
          width: 600,
          quantity: 1,
          edgeBanding: {
            top: true,
            right: true,
            bottom: true,
            left: false
          }
        },
        {
          id: "part3",
          name: "Top",
          material: "PAL Alb",
          thickness: 18,
          length: 564,
          width: 600,
          quantity: 1,
          edgeBanding: {
            top: true,
            right: false,
            bottom: false,
            left: false
          }
        },
        {
          id: "part4",
          name: "Bottom",
          material: "PAL Alb",
          thickness: 18,
          length: 564,
          width: 600,
          quantity: 1,
          edgeBanding: {
            top: false,
            right: false,
            bottom: true,
            left: false
          }
        }
      ],
      totalArea: 1.9, // Total area in m²
      totalLength: 6128 // Total edgebanding length in mm
    };
    
    return mockProject;
  } catch (error) {
    console.error("Error parsing XML:", error);
    return null;
  }
};

/**
 * Calculate material costs based on parts and material prices
 * @param parts List of parts
 * @param materialPrices Material prices per m²
 * @returns Total material cost
 */
export const calculateMaterialCost = (
  parts: XMLPart[], 
  materialPrices: Record<string, number>
): number => {
  let totalCost = 0;
  
  for (const part of parts) {
    const area = (part.length * part.width) / 1000000; // Convert to m²
    const materialPrice = materialPrices[part.material] || 0;
    totalCost += area * materialPrice * part.quantity;
  }
  
  return totalCost;
};

/**
 * Calculate edgebanding costs
 * @param parts List of parts
 * @param edgeBandingPricePerMeter Price per meter of edgebanding
 * @returns Total edgebanding cost
 */
export const calculateEdgeBandingCost = (
  parts: XMLPart[],
  edgeBandingPricePerMeter: number
): number => {
  let totalLength = 0;
  
  for (const part of parts) {
    if (part.edgeBanding) {
      if (part.edgeBanding.top) totalLength += part.width;
      if (part.edgeBanding.bottom) totalLength += part.width;
      if (part.edgeBanding.left) totalLength += part.length;
      if (part.edgeBanding.right) totalLength += part.length;
    }
  }
  
  // Convert mm to meters and multiply by price per meter
  return (totalLength / 1000) * edgeBandingPricePerMeter;
};

/**
 * Calculate painting costs for MDF parts
 * @param parts List of parts
 * @param paintPricePerSquareMeter Price per m² for painting
 * @returns Total painting cost
 */
export const calculatePaintingCost = (
  parts: XMLPart[],
  paintPricePerSquareMeter: number
): number => {
  let totalArea = 0;
  
  // Filter only MDF parts
  const mdfParts = parts.filter(part => 
    part.material.toUpperCase().includes('MDF')
  );
  
  for (const part of mdfParts) {
    // Calculate area in m²
    const area = (part.length * part.width) / 1000000;
    // Count both sides (2 faces)
    totalArea += area * 2 * part.quantity;
  }
  
  return totalArea * paintPricePerSquareMeter;
};
