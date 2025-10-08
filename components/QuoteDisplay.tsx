import React, { useRef, useState, useCallback } from 'react';
import { type QuoteData } from '../types';
import { Logo } from './Logo';

// This is needed for TypeScript to recognize the global htmlToImage object from the script tag
declare const htmlToImage: any;

interface QuoteDisplayProps {
  data: QuoteData;
}

const parseVietnameseNumber = (str: string) => {
    if (typeof str !== 'string') return 0;
    // Remove dots (thousands separators) and replace comma with dot for decimal
    return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}


export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ data }) => {
  const quoteRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadQuote = useCallback(() => {
    if (!quoteRef.current) return;

    const filter = (node: HTMLElement) => {
      return !(node.classList && node.classList.contains('no-print'));
    };

    setIsGenerating(true);
    htmlToImage.toPng(quoteRef.current, { 
        quality: 1, 
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        filter: filter,
     })
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.download = `bao-gia-nam-sao-${new Date().toISOString().slice(0,10)}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err: Error) => {
        console.error('oops, something went wrong!', err);
      })
      .finally(() => {
        setIsGenerating(false);
      });
  }, []);
  
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `Ngày ${day} tháng ${month} năm ${year}`;
  }

  const vatRateNum = parseVietnameseNumber(data.vatRate);
  
  const subTotal = data.items.reduce((acc, item) => {
    const quantity = parseVietnameseNumber(item.quantity);
    const unitPrice = parseVietnameseNumber(item.unitPrice);
    return acc + (quantity * unitPrice);
  }, 0);

  const vat = data.applyVat ? subTotal * (vatRateNum / 100) : 0;
  const grandTotal = subTotal + vat;


  return (
    <div>
      <div ref={quoteRef} className="bg-white p-4 sm:p-8 w-full max-w-[800px] mx-auto text-sm text-black">
        <header className="flex flex-col sm:flex-row justify-between items-start pb-4 border-b-2 border-red-600">
          <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
            {data.companyLogo ? (
                <img src={data.companyLogo} alt="Company Logo" className="max-h-24 sm:max-h-32 max-w-full object-contain" />
            ) : (
                <div className="scale-[0.6] origin-top-left -ml-4">
                    <Logo />
                </div>
            )}
            <div className="mt-4 text-xs text-gray-700 space-y-1">
                <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>92/19 Hà Đặc, Phường Trung Mỹ Tây, TP. Hồ Chí Minh</span>
                </div>
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="font-semibold">Hotline:</span>&nbsp;<span className="font-semibold text-red-600 tracking-wider">0985 252 527</span>
                </div>
            </div>
          </div>
          <div className="w-full text-left sm:text-right">
            <h2 className="text-2xl sm:text-3xl font-bold text-red-600">BÁO GIÁ DỊCH VỤ</h2>
            <p className="mt-1">Số: NS-{new Date().getFullYear()}{String(new Date().getMonth()+1).padStart(2, '0')}{String(new Date().getDate()).padStart(2, '0')}</p>
            <p className="mt-1">{formatDate(new Date())}</p>
          </div>
        </header>

        <section className="mt-6">
            <p className="mb-2"><span className="font-bold">Kính gửi:</span> {data.customerName}</p>
            <p className="mb-2"><span className="font-bold">Địa chỉ:</span> {data.address}</p>
            <p className="mb-4"><span className="font-bold">Email:</span> {data.email} <span className="font-bold ml-4">Điện thoại:</span> {data.phone}</p>
            <p>Công ty Vệ sinh Công nghiệp Năm Sao xin trân trọng gửi đến Quý khách hàng báo giá chi tiết cho các hạng mục vệ sinh như sau:</p>
        </section>

        <section className="mt-6">
            <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm">
                <thead>
                    <tr className="bg-red-600 text-white">
                        <th className="border border-gray-300 p-1 sm:p-2 text-center font-bold">STT</th>
                        <th className="border border-gray-300 p-1 sm:p-2 text-left font-bold">Hạng mục công việc</th>
                        <th className="border border-gray-300 p-1 sm:p-2 text-center font-bold">Số lượng</th>
                        <th className="border border-gray-300 p-1 sm:p-2 text-right font-bold">Đơn giá</th>
                        <th className="border border-gray-300 p-1 sm:p-2 text-right font-bold">Thành tiền (VND)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, index) => {
                        const quantityNum = parseVietnameseNumber(item.quantity);
                        const unitPriceNum = parseVietnameseNumber(item.unitPrice);
                        const lineTotal = quantityNum * unitPriceNum;

                        return (
                            <tr key={index} className="text-black">
                                <td className="border border-gray-300 p-1 sm:p-2 text-center">{index + 1}</td>
                                <td className="border border-gray-300 p-1 sm:p-2 whitespace-pre-line">{item.description}</td>
                                <td className="border border-gray-300 p-1 sm:p-2 text-center">{`${item.quantity} ${item.unit}`}</td>
                                <td className="border border-gray-300 p-1 sm:p-2 text-right">{`${formatCurrency(unitPriceNum)} / ${item.unit}`}</td>
                                <td className="border border-gray-300 p-1 sm:p-2 text-right">{formatCurrency(lineTotal)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>

        <section className="mt-4 flex justify-end">
            <div className="w-full sm:w-2/5">
                <div className="flex justify-between">
                    <span className="font-bold">Cộng tiền hàng:</span>
                    <span>{formatCurrency(subTotal)}</span>
                </div>
                 {data.applyVat && (
                    <div className="flex justify-between mt-1">
                        <span className="font-bold">Thuế GTGT ({vatRateNum}%):</span>
                        <span>{formatCurrency(vat)}</span>
                    </div>
                 )}
                <div className="flex justify-between mt-2 pt-2 border-t font-bold text-red-600 text-base">
                    <span>TỔNG CỘNG:</span>
                    <span>{formatCurrency(grandTotal)}</span>
                </div>
            </div>
        </section>

        <section className="mt-6 text-xs">
            <p className="font-bold mb-1">Ghi chú:</p>
            <ul className="list-disc list-inside">
                {!data.applyVat && <li>Báo giá trên chưa bao gồm thuế GTGT {vatRateNum}%.</li>}
                <li>Báo giá có hiệu lực trong vòng 30 ngày.</li>
                <li>Đơn giá trên áp dụng cho điều kiện thi công thông thường.</li>
            </ul>
        </section>

        <footer className="mt-12 flex justify-around text-center">
            <p className="font-bold">                                                </p>
                
            <div>
                <p className="font-bold">Đại diện Công ty Năm Sao</p>
                <p className="italic">(Ký, ghi rõ họ tên, đóng dấu)</p>
                <div className="h-28 w-48 my-2 flex items-center justify-center">
                    {data.signatureImage ? (
                        <img src={data.signatureImage} alt="Chữ ký" className="h-full w-full object-contain" />
                    ) : (
                       <div className="w-full h-full"></div> 
                    )}
                </div>
                
            </div>
        </footer>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={downloadQuote}
          disabled={isGenerating}
          className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 flex items-center justify-center mx-auto no-print"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </>
          ) : (
            'Tải xuống Báo giá (.png)'
          )}
        </button>
      </div>
    </div>
  );
};