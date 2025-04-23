export const allColumns = [
  { id: 'id', label: 'ID', minWidth: 50, description: 'Unique identifier for the case study' },
  { id: 'containerPlate', label: 'Container Plate', minWidth: 150, description: 'Identification plate of the container' },
  { id: 'cargoDescription', label: 'Cargo Description', minWidth: 200, description: 'Description of the cargo contents' },
  { id: 'message', label: 'Message', minWidth: 150, description: 'Associated message information' },
  { id: 'movementDate', label: 'Movement Date', minWidth: 120, description: 'Date when the container was moved' },
  { id: 'embarkationPort', label: 'Embarkation Port', minWidth: 150, description: 'Port where cargo was loaded' },
  { id: 'disembarkationPort', label: 'Disembarkation Port', minWidth: 150, description: 'Port where cargo will be unloaded' },
  { id: 'transhipment', label: 'Transhipment', minWidth: 120, description: 'Transfer of cargo from one vessel to another' },
  { id: 'isoContentainer', label: 'ISO Container', minWidth: 120, description: 'ISO standard container information' },
  { id: 'isoContentainerRegistry', label: 'ISO Container Registry', minWidth: 180, description: 'Registry information for the ISO container' },
  { id: 'containerTare', label: 'Container Tare', minWidth: 120, description: 'Weight of the empty container' },
  { id: 'containerState', label: 'Container State', minWidth: 120, description: 'State of the container' },
  { id: 'harmonizedCode', label: 'Harmonized Code', minWidth: 150, description: '8-digit identifier', isCode: true, codeType: '8-digit', hasLabel: 'cn20078PLabelEN' },
  { id: 'weight', label: 'Weight (kg)', minWidth: 100, align: 'right', format: (value) => value?.toLocaleString(), description: 'Weight of cargo in kilograms' },
  { id: 'brokenPackagesQuantity', label: 'Broken Packages Qty', minWidth: 150, description: 'Quantity of damaged packages' },
  { id: 'packagesQuantity', label: 'Packages Qty', minWidth: 120, description: 'Total quantity of packages' },
  { id: 'departureWeight', label: 'Departure Weight', minWidth: 130, description: 'Weight at departure' },
  { id: 'nst20073P', label: 'NST 3P', minWidth: 100, description: '3-digit identifier', isCode: true, codeType: '3-digit', hasLabel: 'nst20073PLabelEN' },
  { id: 'nst20072P', label: 'NST 2P', minWidth: 100, description: '2-digit identifier', isCode: true, codeType: '2-digit', hasLabel: 'nst20072PLabelEN' },
  { id: 'prov2', label: 'Prov2', minWidth: 80, description: 'Data prov information' },
  { id: 'prov', label: 'Prov', minWidth: 80, description: 'Data prov information' }
];

export const defaultDisplayColumns = ['id', 'containerPlate', 'cargoDescription', 'nst20073P', 'prov2', 'weight'];

// Maximum number of columns allowed
export const MAX_COLUMNS = 7;