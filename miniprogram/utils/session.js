const STORAGE_KEYS = {
  medicalDisclaimer: 'medical_disclaimer',
  legacyMedicalDisclaimer: 'disclaimerConfirmed',
  deliveryType: 'delivery_type',
  legacyDeliveryType: 'deliveryType',
  phase2Check: 'phase2_check',
  currentPhase: 'current_phase'
};

function normalizeDeliveryType(value) {
  if (value === 'cs' || value === 'csection') return 'cs';
  if (value === 'vd' || value === 'vaginal') return 'vd';
  return '';
}

function getMedicalDisclaimer() {
  return !!(
    wx.getStorageSync(STORAGE_KEYS.medicalDisclaimer) ||
    wx.getStorageSync(STORAGE_KEYS.legacyMedicalDisclaimer)
  );
}

function setMedicalDisclaimer(value) {
  wx.setStorageSync(STORAGE_KEYS.medicalDisclaimer, !!value);
  wx.setStorageSync(STORAGE_KEYS.legacyMedicalDisclaimer, !!value);
}

function getDeliveryType() {
  return normalizeDeliveryType(
    wx.getStorageSync(STORAGE_KEYS.deliveryType) ||
    wx.getStorageSync(STORAGE_KEYS.legacyDeliveryType)
  );
}

function setDeliveryType(value) {
  var normalized = normalizeDeliveryType(value);
  if (!normalized) return '';
  wx.setStorageSync(STORAGE_KEYS.deliveryType, normalized);
  wx.setStorageSync(STORAGE_KEYS.legacyDeliveryType, normalized === 'cs' ? 'csection' : 'vaginal');
  return normalized;
}

function getPhase2Check() {
  return !!wx.getStorageSync(STORAGE_KEYS.phase2Check);
}

function setPhase2Check(value) {
  wx.setStorageSync(STORAGE_KEYS.phase2Check, !!value);
}

function getCurrentPhase() {
  var phase = Number(wx.getStorageSync(STORAGE_KEYS.currentPhase) || 1);
  return phase === 2 ? 2 : 1;
}

function setCurrentPhase(value) {
  var phase = Number(value) === 2 ? 2 : 1;
  wx.setStorageSync(STORAGE_KEYS.currentPhase, phase);
  return phase;
}

module.exports = {
  STORAGE_KEYS: STORAGE_KEYS,
  getMedicalDisclaimer: getMedicalDisclaimer,
  setMedicalDisclaimer: setMedicalDisclaimer,
  getDeliveryType: getDeliveryType,
  setDeliveryType: setDeliveryType,
  getPhase2Check: getPhase2Check,
  setPhase2Check: setPhase2Check,
  getCurrentPhase: getCurrentPhase,
  setCurrentPhase: setCurrentPhase,
  normalizeDeliveryType: normalizeDeliveryType
};
