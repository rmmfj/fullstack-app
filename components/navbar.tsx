import AuthButton from "./logout-button";

const Navbar = () => {
  return (
    <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
      <div className='w-full max-w-4xl flex justify-between items-center p-3 text-sm'>
        <a href='/experimental/reminder'>
          <h2>提醒訊息實驗室</h2>
        </a>
        <a href='/experimental/image'>
          <h2>錫罐圖片實驗室</h2>
        </a>
        <a href='/experimental/storage'>
          <h2>內容伺服器實驗室</h2>
        </a>
        <a href='/experimental/database'>
          <h2>（開發中）資料庫實驗室</h2>
        </a>
        <AuthButton />
      </div>
    </nav>
  );
};

export default Navbar;
