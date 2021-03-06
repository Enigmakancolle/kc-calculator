import { api_mst_ship, TMstAllyShip, TMstShip, TStatTuple } from '@kancolle/data'
import fs from 'fs'
import ships, { IShipData } from '../ships.json'

const writeStats = (stats1: TStatTuple | number, stats2: TStatTuple) => {
  if (typeof stats1 === 'number') {
    return
  }
  stats1[0] = stats2[0]
  stats1[1] = stats2[1]
}

const getSlotCapacities = (mstShip: TMstShip, shipData?: IShipData) => {
  const { api_slot_num } = mstShip
  if ('api_maxeq' in mstShip) {
    const { api_maxeq } = mstShip
    return Array.from({ length: api_slot_num }, (_, i) => api_maxeq[i])
  }
  if (!shipData) {
    return new Array(api_slot_num).fill(-1)
  }
  return shipData.slotCapacities
}

const getRemodel = (mstShip: TMstShip) => {
  if ('api_afterlv' in mstShip) {
    const { api_aftershipid, api_afterlv } = mstShip
    return {
      nextId: Number(api_aftershipid),
      nextLevel: api_afterlv
    }
  }
  return {
    nextId: 0,
    nextLevel: 0
  }
}

const createShipData = (apiShip: TMstShip): IShipData => {
  if ('api_houg' in apiShip) {
    return {
      id: apiShip.api_id,
      sortNo: apiShip.api_sortno,
      sortId: apiShip.api_sort_id,
      name: apiShip.api_name,
      readingName: apiShip.api_yomi,
      shipTypeId: apiShip.api_stype,
      classId: apiShip.api_ctype,
      hp: apiShip.api_taik,
      firepower: apiShip.api_houg,
      armor: apiShip.api_souk,
      torpedo: apiShip.api_raig,
      evasion: -1,
      asw: -1,
      los: -1,
      antiAir: apiShip.api_tyku,
      speed: apiShip.api_soku,
      range: apiShip.api_leng,
      luck: apiShip.api_luck,
      fuel: apiShip.api_fuel_max,
      ammo: apiShip.api_bull_max,
      slotCapacities: getSlotCapacities(apiShip),
      equipments: [],
      remodel: getRemodel(apiShip)
    }
  }
  return {
    id: apiShip.api_id,
    sortNo: 0,
    sortId: apiShip.api_sort_id,
    name: apiShip.api_name,
    readingName: apiShip.api_yomi,
    shipTypeId: apiShip.api_stype,
    classId: apiShip.api_ctype,
    hp: -2,
    firepower: -2,
    armor: -2,
    torpedo: -2,
    evasion: -1,
    asw: -1,
    los: -1,
    antiAir: -2,
    speed: apiShip.api_soku,
    range: -2,
    luck: -2,
    fuel: 0,
    ammo: 0,
    slotCapacities: getSlotCapacities(apiShip),
    equipments: [],
    remodel: getRemodel(apiShip)
  }
}

const newShipsData = new Array<IShipData>()
for (const apiShip of api_mst_ship) {
  const shipData = ships.find(({ id }) => id === apiShip.api_id)

  if (!shipData) {
    console.error(`create ${apiShip.api_name}`)
    newShipsData.push(createShipData(apiShip))
    continue
  }

  if ('api_houg' in apiShip) {
    writeStats(shipData.firepower, apiShip.api_houg)
    writeStats(shipData.torpedo, apiShip.api_raig)
    writeStats(shipData.armor, apiShip.api_souk)
    writeStats(shipData.antiAir, apiShip.api_tyku)
  }

  newShipsData.push(shipData)
}

fs.writeFile('./scripts/ships.json', JSON.stringify(newShipsData), err => console.error(err))
