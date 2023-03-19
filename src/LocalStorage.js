import { useState, useEffect } from "react";

export const getSavedValue = (key) => {
  const savedValue = JSON.parse(localStorage.getItem(key));
  if (!savedValue) return null;
  return savedValue;
};

export default function addToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
