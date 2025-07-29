import { css } from 'lit';

export const sharedStyles = css`
  * { box-sizing: border-box; }
  body {
    margin: 0;
  }
  .container {
    max-width: 900px;
    margin: 40px auto;
    padding: 24px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px #0001;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
  }
  th {
    background: #f4f4f4;
  }
  .actions button, .actions a {
    margin-right: 8px;
  }
  @media (max-width: 600px) {
    .container { padding: 4px; }
    table, thead, tbody, th, td, tr {
      display: block;
    }
    th { display: none; }
    td {
      border: none;
      padding: 8px 4px;
      position: relative;
      font-size: .95em;
    }
    td:before {
      position: absolute;
      left: 6px; top: 8px;
      font-weight: bold;
      color: #666;
      white-space: nowrap;
      content: attr(data-label);
    }
    .actions { margin-top: 6px; }
  }
`;