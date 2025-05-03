import { Database } from '../lib/db';

export const initialDB: Database = {
  categories: [
    {
      name: "Accesorii",
      subcategories: [
        {
          name: "Glisiere",
          fields: [
            {
              name: "Type",
              type: "select",
              options: ["Tandem", "Legrabox"]
            },
            {
              name: "Glisare",
              type: "select",
              options: ["Normal", "Push to Open"]
            },
            {
              name: "Extragere",
              type: "select",
              options: ["Totală", "Parțială"]
            },
            {
              name: "Dimensiuni",
              type: "select",
              options: ["250mm", "300mm", "350mm", "400mm", "450mm", "500mm", "550mm", "600mm"]
            }
          ],
          products: [
            {
              id: "g1",
              cod: "GL-TN-250",
              pret: 35.5,
              Type: "Tandem",
              Glisare: "Normal",
              Extragere: "Parțială",
              Dimensiuni: "250mm"
            },
            {
              id: "g2",
              cod: "GL-TP-250",
              pret: 45.5,
              Type: "Tandem",
              Glisare: "Push to Open",
              Extragere: "Parțială",
              Dimensiuni: "250mm"
            },
            {
              id: "g3",
              cod: "GL-LN-300",
              pret: 55.5,
              Type: "Legrabox",
              Glisare: "Normal",
              Extragere: "Totală",
              Dimensiuni: "300mm"
            },
            {
              id: "g4",
              cod: "GL-LP-400",
              pret: 65.5,
              Type: "Legrabox",
              Glisare: "Push to Open",
              Extragere: "Totală",
              Dimensiuni: "400mm"
            }
          ]
        },
        {
          name: "Balamale",
          fields: [
            {
              name: "Tip",
              type: "select",
              options: ["Aplicată", "Semi-aplicată", "Încadrată"]
            }
          ],
          products: [
            {
              id: "b1",
              cod: "BL-AP-DR",
              pret: 12.5,
              Tip: "Aplicată"
            },
            {
              id: "b2",
              cod: "BL-AP-CR",
              pret: 13.5,
              Tip: "Aplicată"
            },
            {
              id: "b3",
              cod: "BL-SA-DR",
              pret: 14.5,
              Tip: "Semi-aplicată"
            },
            {
              id: "b4",
              cod: "BL-IN-CR",
              pret: 16.5,
              Tip: "Încadrată"
            }
          ]
        },
        {
          name: "Picioare",
          fields: [
            {
              name: "Înălțime",
              type: "select",
              options: ["30mm", "80mm", "100mm", "150mm"]
            },
            {
              name: "Material",
              type: "select",
              options: ["Plastic", "Metal"]
            }
          ],
          products: [
            {
              id: "p1",
              cod: "PC-30-PL",
              pret: 2.5,
              Înălțime: "30mm",
              Material: "Plastic"
            },
            {
              id: "p2",
              cod: "PC-80-PL",
              pret: 3.5,
              Înălțime: "80mm",
              Material: "Plastic"
            },
            {
              id: "p3",
              cod: "PC-100-MT",
              pret: 8.5,
              Înălțime: "100mm",
              Material: "Metal"
            },
            {
              id: "p4",
              cod: "PC-150-MT",
              pret: 12.5,
              Înălțime: "150mm",
              Material: "Metal"
            }
          ]
        },
        {
          name: "Jolly",
          fields: [
            {
              name: "Dimensiune",
              type: "select",
              options: ["150mm", "200mm", "300mm"]
            }
          ],
          products: [
            {
              id: "j1",
              cod: "JL-150",
              pret: 18.5,
              Dimensiune: "150mm"
            },
            {
              id: "j2",
              cod: "JL-200",
              pret: 22.5,
              Dimensiune: "200mm"
            },
            {
              id: "j3",
              cod: "JL-300",
              pret: 28.5,
              Dimensiune: "300mm"
            }
          ]
        }
      ]
    },
    {
      name: "PAL",
      subcategories: [
        {
          name: "Decor",
          fields: [
            {
              name: "Culoare",
              type: "select",
              options: ["Alb", "Gri", "Stejar", "Nuc", "Negru"]
            }
          ],
          products: [
            {
              id: "pal1",
              cod: "PAL-ALB",
              pret: 65,
              Culoare: "Alb",
              "Pret/mp": 23.21,
              "Pret/coala": 65
            },
            {
              id: "pal2",
              cod: "PAL-GRI",
              pret: 68,
              Culoare: "Gri",
              "Pret/mp": 24.29,
              "Pret/coala": 68
            },
            {
              id: "pal3",
              cod: "PAL-STJ",
              pret: 75,
              Culoare: "Stejar",
              "Pret/mp": 26.79,
              "Pret/coala": 75
            },
            {
              id: "pal4",
              cod: "PAL-NUC",
              pret: 78,
              Culoare: "Nuc",
              "Pret/mp": 27.86,
              "Pret/coala": 78
            }
          ]
        }
      ]
    },
    {
      name: "MDF",
      subcategories: [
        {
          name: "Drept",
          fields: [
            {
              name: "Grosime",
              type: "select",
              options: ["16mm", "18mm", "22mm", "40mm"]
            },
            {
              name: "Vopsire",
              type: "select",
              options: ["1 față", "2 fețe"]
            },
            {
              name: "Mâner frezat",
              type: "boolean"
            }
          ],
          products: [
            {
              id: "mdf1",
              cod: "MDF-DR-16-1",
              pret: 85,
              Grosime: "16mm",
              Vopsire: "1 față",
              "Mâner frezat": false
            },
            {
              id: "mdf2",
              cod: "MDF-DR-16-2",
              pret: 115,
              Grosime: "16mm",
              Vopsire: "2 fețe",
              "Mâner frezat": false
            },
            {
              id: "mdf3",
              cod: "MDF-DR-18-1",
              pret: 95,
              Grosime: "18mm",
              Vopsire: "1 față",
              "Mâner frezat": false
            },
            {
              id: "mdf4",
              cod: "MDF-DR-18-2",
              pret: 125,
              Grosime: "18mm",
              Vopsire: "2 fețe",
              "Mâner frezat": false
            }
          ]
        },
        {
          name: "Riflat",
          fields: [
            {
              name: "Grosime",
              type: "select",
              options: ["16mm", "18mm", "22mm"]
            },
            {
              name: "Vopsire",
              type: "select",
              options: ["1 față", "2 fețe"]
            }
          ],
          products: [
            {
              id: "mdf5",
              cod: "MDF-RF-16-1",
              pret: 110,
              Grosime: "16mm",
              Vopsire: "1 față"
            },
            {
              id: "mdf6",
              cod: "MDF-RF-16-2",
              pret: 145,
              Grosime: "16mm",
              Vopsire: "2 fețe"
            },
            {
              id: "mdf7",
              cod: "MDF-RF-18-1",
              pret: 120,
              Grosime: "18mm",
              Vopsire: "1 față"
            }
          ]
        },
        {
          name: "Frezat Clasic",
          fields: [
            {
              name: "Grosime",
              type: "select",
              options: ["18mm", "22mm", "40mm"]
            },
            {
              name: "Vopsire",
              type: "select",
              options: ["1 față", "2 fețe"]
            }
          ],
          products: [
            {
              id: "mdf8",
              cod: "MDF-FC-18-1",
              pret: 125,
              Grosime: "18mm",
              Vopsire: "1 față"
            },
            {
              id: "mdf9",
              cod: "MDF-FC-18-2",
              pret: 165,
              Grosime: "18mm",
              Vopsire: "2 fețe"
            },
            {
              id: "mdf10",
              cod: "MDF-FC-22-1",
              pret: 145,
              Grosime: "22mm",
              Vopsire: "1 față"
            }
          ]
        }
      ]
    }
  ]
};
