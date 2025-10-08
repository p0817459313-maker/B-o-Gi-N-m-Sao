import React, { useState } from 'react';
import { type QuoteData, type QuoteItem } from '../types';

interface QuoteFormProps {
  onGenerate: (data: QuoteData) => void;
}

const quickAddItems = [
  'Vệ sinh kính mặt ngoài tòa nhà',
  'Vệ sinh tổng thể sau xây dựng',
  'Chà sàn nhà xưởng',
  'Hút bụi công nghiệp',
  'Lau sàn, tường, trần',
  'Vệ sinh khu vực văn phòng',
  'Giặt thảm, giặt ghế sofa',
  'Đánh bóng sàn đá',
];


export const QuoteForm: React.FC<QuoteFormProps> = ({ onGenerate }) => {
  const [customerName, setCustomerName] = useState('Công ty TNHH BOE');
  const [address, setAddress] = useState('123 Đường XYZ, Quận 1, TP. HCM');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vatRate, setVatRate] = useState('8');
  const [applyVat, setApplyVat] = useState(true);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: `item-${Date.now()}`,
      description: 'Vệ sinh tổng thể nhà xưởng sau xây dựng',
      unit: 'm²',
      quantity: '5.002',
      unitPrice: '12000',
    },
  ]);

  const handleItemChange = (id: string, field: keyof Omit<QuoteItem, 'id'>, value: string) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems(currentItems => [
      ...currentItems,
      {
        id: `item-${Date.now()}`,
        description: '',
        unit: 'm²',
        quantity: '1',
        unitPrice: '0',
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return; // Prevent removing the last item
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const addQuickItem = (description: string) => {
    // If the first and only item is empty, just fill it.
    if (items.length === 1 && items[0].description.trim() === '') {
       handleItemChange(items[0].id, 'description', description);
       return;
    }
    
    setItems(currentItems => [
      ...currentItems,
      {
        id: `item-${Date.now()}`,
        description: description,
        unit: 'm²',
        quantity: '1',
        unitPrice: '0',
      },
    ]);
  };


  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      customerName,
      address,
      email,
      phone,
      items,
      vatRate,
      applyVat,
      signatureImage,
      companyLogo,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Thông tin Báo giá</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      
        <div className="pt-2 pb-4 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo công ty (Tùy chọn)
            </label>
            <div className="flex flex-col items-center">
                <div className="h-28 w-48 mb-2 flex items-center justify-center">
                    {companyLogo ? (
                        <img src={companyLogo} alt="Logo công ty" className="h-full w-full object-contain border rounded-md p-1" />
                    ) : (
                        <label htmlFor="logo-upload-form" className="cursor-pointer group text-gray-500 hover:border-red-500 hover:text-red-600 text-center p-2 border-2 border-dashed rounded-lg w-full h-full flex flex-col justify-center items-center transition-colors">
                            <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs mt-1 font-medium">Tải lên Logo</span>
                        </label>
                    )}
                    <input id="logo-upload-form" type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </div>
                {companyLogo && (
                    <button
                        type="button"
                        onClick={() => setCompanyLogo(null)}
                        className="mt-2 text-xs text-red-500 hover:underline"
                    >
                        Xóa logo
                    </button>
                )}
            </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 pt-2">Thông tin khách hàng</h3>

        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
            Tên khách hàng
          </label>
          <input
            type="text"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900"
          />
        </div>

        <div className="space-y-4 border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800">Các hạng mục báo giá</h3>
            {items.map((item) => (
                <div key={item.id} className="p-4 border rounded-lg bg-gray-50 relative space-y-3 shadow-sm">
                    {items.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors"
                            aria-label="Xóa hạng mục"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                    <div>
                        <label htmlFor={`description-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Hạng mục công việc
                        </label>
                        <textarea
                            id={`description-${item.id}`}
                            rows={2}
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-500"
                            placeholder="Ví dụ: Vệ sinh kính mặt ngoài..."
                            required
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label htmlFor={`unit-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Đơn vị
                            </label>
                            <select
                                id={`unit-${item.id}`}
                                value={item.unit}
                                onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900"
                            >
                                <option value="m²">m²</option>
                                <option value="cái">cái</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor={`quantity-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Số lượng ({item.unit})
                            </label>
                             <input
                                type="text"
                                id={`quantity-${item.id}`}
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor={`unitPrice-${item.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Đơn giá (VND/{item.unit})
                            </label>
                            <input
                                type="number"
                                id={`unitPrice-${item.id}`}
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900"
                                required
                            />
                        </div>
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={addItem}
                className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-300"
            >
                + Thêm Hạng mục
            </button>
             <div className="pt-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Thêm nhanh hạng mục:</p>
                <div className="flex flex-wrap gap-2">
                {quickAddItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => addQuickItem(item)}
                    className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
        </div>
        
        <div className="border-t pt-4 space-y-2">
            <div className="flex items-center">
                <input
                    id="applyVat"
                    name="applyVat"
                    type="checkbox"
                    checked={applyVat}
                    onChange={(e) => setApplyVat(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="applyVat" className="ml-2 block text-sm font-medium text-gray-700">
                    Áp dụng Thuế GTGT (%)
                </label>
            </div>
            {applyVat && (
                 <div>
                    <label htmlFor="vatRate" className="sr-only">
                        Phần trăm Thuế GTGT
                    </label>
                    <input
                        type="number"
                        id="vatRate"
                        value={vatRate}
                        onChange={(e) => setVatRate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-gray-900"
                        required
                    />
                </div>
            )}
        </div>
        

        <div className="pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chữ ký & Dấu (Tùy chọn)
          </label>
          <div className="flex flex-col items-center">
              <div className="h-28 w-48 mb-2 flex items-center justify-center">
                  {signatureImage ? (
                      <img src={signatureImage} alt="Chữ ký" className="h-full w-full object-contain border rounded-md" />
                  ) : (
                      <label htmlFor="signature-upload-form" className="cursor-pointer group text-gray-500 hover:border-red-500 hover:text-red-600 text-center p-2 border-2 border-dashed rounded-lg w-full h-full flex flex-col justify-center items-center transition-colors">
                          <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span className="text-xs mt-1 font-medium">Tải lên Chữ ký / Dấu</span>
                      </label>
                  )}
                  <input id="signature-upload-form" type="file" className="hidden" accept="image/*" onChange={handleSignatureUpload} />
              </div>
              {signatureImage && (
                  <button 
                      type="button"
                      onClick={() => setSignatureImage(null)} 
                      className="mt-2 text-xs text-red-500 hover:underline"
                  >
                      Xóa ảnh
                  </button>
              )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
        >
          Tạo Báo Giá
        </button>
      </form>
    </div>
  );
};