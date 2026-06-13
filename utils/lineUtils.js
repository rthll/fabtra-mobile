export const normalizeLineList = (value) => {
  if (Array.isArray(value)) {
    return [...new Set(
      value
        .map((item) => String(item || '').trim())
        .filter(Boolean)
    )];
  }

  const singleValue = String(value || '').trim();
  return singleValue ? [singleValue] : [];
};

export const getPrimaryLine = (value) => normalizeLineList(value)[0] || '';

export const supportsLine = (value, activeLine) => {
  if (!activeLine) {
    return true;
  }

  return normalizeLineList(value).includes(String(activeLine).trim());
};

export const formatLines = (value) => normalizeLineList(value).join(', ');
