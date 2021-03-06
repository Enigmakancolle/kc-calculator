import EquipmentCategory from '../src/data/EquipmentCategory'

describe('EquipmentCategory', () => {
  it('SmallCaliberMainGun', () => {
    const category = EquipmentCategory.fromId(1)
    expect(category.id).toBe(1)
    expect(category.name).toBe('小口径主砲')
    expect(category.equal('SmallCaliberMainGun')).toBeTruthy()
    expect(category.equal('Torpedo')).toBeFalsy()
  })
})
