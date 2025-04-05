import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // xlsxライブラリをインポート
import './App.css';

function App() {
  // 生徒評価の状態管理用
  const [evaluations, setEvaluations] = useState(
    Array(40).fill(0) // 1〜40番までの生徒評価（初期値は0）
  );
  const [title, setTitle] = useState(''); // タイトル入力の状態管理

  // 評価の変更を処理する関数
  const handleEvaluationChange = (index, value) => {
    const newEvaluations = [...evaluations];
    // もし選択した評価が現在の評価と同じなら、選択を解除（0に戻す）
    newEvaluations[index] = newEvaluations[index] === value ? 0 : value;
    setEvaluations(newEvaluations);
  };

  // タイトルの変更を処理する関数
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Excelファイル出力の関数
  const exportToExcel = () => {
    // タイトルが空でなければタイトルをファイル名に使用、空ならデフォルト名
    const fileName = title.trim() !== '' ? `${title}.xlsx` : 'student_evaluations.xlsx';

    // Excelに書き込むデータを構成
    const worksheetData = [
      ['生徒番号', '評価'], // ヘッダー
      ...evaluations.map((evaluation, index) => [
        index + 1, // 出席番号
        evaluation === 0 ? { v: '', s: { fill: { fgColor: { rgb: "FFFF00" } } } } : evaluation // 評価が0なら空白、網掛け
      ])
    ];

    // Excelワークシートを作成
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // ワークブックの作成
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '評価一覧');

    // Excelファイルのダウンロード
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="App">
      <h1>生徒評価アプリ</h1>
      <div>
        <label>
          タイトル:
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="例: 技術科 中1 評価1"
          />
        </label>
      </div>
      
      <div>
        <h2>評価一覧</h2>
        <div className="student-evaluations">
          {Array.from({ length: 40 }, (_, index) => (
            <div className="student-row" key={index}>
              <span className="student-number">出席番号 {index + 1}</span>
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    className={`rating-button ${evaluations[index] === value ? 'selected' : ''}`}
                    onClick={() => handleEvaluationChange(index, value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button onClick={exportToExcel}>Excelで出力</button>
    </div>
  );
}

export default App;
