
import React, { useState } from 'react';
import { QuoteForm } from './components/QuoteForm';
import { QuoteDisplay } from './components/QuoteDisplay';
import { type QuoteData } from './types';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);

  const handleGenerateQuote = (data: QuoteData) => {
    setQuoteData(data);
  };

  return (
   <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
         <div className="flex justify-center items-center scale-75 sm:scale-100"> 
             <Logo />
         </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mt-2">
          Trình tạo Báo giá Dịch vụ
        </h1>
        <p className="text-gray-500">
          Nhập thông tin chi tiết để tạo báo giá chuyên nghiệp cho khách hàng.
        </p>
      </header>

      <main className="container mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <QuoteForm onGenerate={handleGenerateQuote} />
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-lg h-full">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">Bản xem trước Báo giá</h2>
            {quoteData ? (
              <QuoteDisplay data={quoteData} />
            ) : (
              <div className="flex items-center justify-center h-96 bg-gray-100 rounded-md">
                <p className="text-gray-500 text-center">
                  Báo giá sẽ được hiển thị ở đây sau khi bạn nhập thông tin.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="text-center mt-12 text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Vệ sinh Công nghiệp Năm Sao. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
