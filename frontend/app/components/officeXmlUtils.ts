export function xmlDocument(xml: string) {
  return new DOMParser().parseFromString(xml, "application/xml");
}

export function localName(element: Element) {
  return element.localName || element.tagName.split(":").pop() || element.tagName;
}

export function childElements(element: Element, name: string) {
  return Array.from(element.children).filter((child) => localName(child) === name);
}

export function firstChildText(element: Element, name: string) {
  return childElements(element, name)[0]?.textContent ?? "";
}

export function textFromDrawingXml(xml: string) {
  const documentXml = xmlDocument(xml);
  return Array.from(documentXml.getElementsByTagName("a:t"))
    .map((node) => node.textContent?.trim() ?? "")
    .filter(Boolean);
}
