// Markdown -> HTML formatter for Gemini responses, plus a top-level
// formatter that understands the structured { type, content, language,
// explanation } object returned by the Gemini API.

const escapeHtml = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatInline = (text) => {
  let escaped = escapeHtml(text);

  // inline code `code`
  escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");

  // bold **text**
  escaped = escaped.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

  // italic *text* (avoid matching leftover list markers)
  escaped = escaped.replace(/(?<!\*)\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, "<i>$1</i>");

  return escaped;
};

// Converts a markdown string into HTML: headings, bold/italic/code,
// fenced code blocks, bullet/numbered lists, and paragraphs.
export const markdownToHtml = (rawText) => {
  const text = rawText.replace(/\r\n/g, "\n");
  const lines = text.split("\n");

  let html = "";
  let inCodeBlock = false;
  let codeLang = "";
  let codeBuffer = [];
  let listType = null; // "ul" | "ol"
  let paragraphBuffer = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length) {
      html += `<p>${paragraphBuffer.map(formatInline).join("<br/>")}</p>`;
      paragraphBuffer = [];
    }
  };

  const closeList = () => {
    if (listType) {
      html += `</${listType}>`;
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const fenceMatch = line.match(/^```(\w*)/);
    if (fenceMatch) {
      if (!inCodeBlock) {
        flushParagraph();
        closeList();
        inCodeBlock = true;
        codeLang = fenceMatch[1] || "";
        codeBuffer = [];
      } else {
        html += `<pre><code class="lang-${codeLang}">${escapeHtml(
          codeBuffer.join("\n")
        )}</code></pre>`;
        inCodeBlock = false;
        codeLang = "";
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      closeList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      html += `<h${level}>${formatInline(headingMatch[2])}</h${level}>`;
      continue;
    }

    const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      if (listType !== "ul") {
        closeList();
        html += "<ul>";
        listType = "ul";
      }
      html += `<li>${formatInline(bulletMatch[1])}</li>`;
      continue;
    }

    const numberedMatch = trimmed.match(/^\d+[.)]\s+(.*)$/);
    if (numberedMatch) {
      flushParagraph();
      if (listType !== "ol") {
        closeList();
        html += "<ol>";
        listType = "ol";
      }
      html += `<li>${formatInline(numberedMatch[1])}</li>`;
      continue;
    }

    closeList();
    paragraphBuffer.push(trimmed);
  }

  if (inCodeBlock && codeBuffer.length) {
    html += `<pre><code class="lang-${codeLang}">${escapeHtml(
      codeBuffer.join("\n")
    )}</code></pre>`;
  }
  flushParagraph();
  closeList();

  return html;
};

// Renders a code string as an HTML <pre><code> block, escaped.
export const codeToHtml = (code, language = "") => {
  return `<pre><code class="lang-${escapeHtml(
    language
  )}">${escapeHtml(code)}</code></pre>`;
};

// Top-level: takes the structured Gemini response { type, content, language, explanation }
// and returns HTML ready for dangerouslySetInnerHTML.
const formatResponse = (response) => {
  // Backwards compatibility: if a plain string is passed, treat as markdown.
  if (typeof response === "string") {
    return markdownToHtml(response);
  }

  if (!response || typeof response.content !== "string") {
    return "";
  }

  const { type, content, language, explanation } = response;

  switch (type) {
    case "code": {
      let html = codeToHtml(content, language || "");
      if (explanation && explanation.trim()) {
        html += markdownToHtml(explanation);
      }
      return html;
    }
    case "markdown":
      return markdownToHtml(content);
    case "text":
    default:
      return markdownToHtml(content);
  }
};

export default formatResponse;
