🎮 DevCopet - Gamified Programming Learning Platform
DevCopet là nền tảng học lập trình kết hợp nuôi thú cưng AI, tập trung vào trải nghiệm học tập qua cơ chế Game-map và Evolution Loop. Dự án được xây dựng trên nền tảng React + TypeScript + Vite với cấu trúc chuẩn Bulletproof.

🛠️ Bộ công cụ & Workflow
Dự án này áp dụng quy trình kiểm soát chất lượng tự động. Bạn không thể commit nếu code không sạch hoặc message không đúng chuẩn:

Husky & lint-staged: Tự động chạy Prettier để nắn dòng và ESLint để check lỗi ngay khi bạn gõ lệnh git commit.

Commitlint: Bắt buộc sử dụng chuẩn Conventional Commits. Lời nhắn commit theo cấu trúc sau:
type: subject (Lưu ý: Bắt buộc phải có dấu cách sau dấu hai chấm).

Trong đó, type thường là một trong các từ khóa sau:

feat: Thêm một tính năng mới.

fix: Sửa một lỗi (bug).

chore: Các công việc lặt vặt, cấu hình, không ảnh hưởng đến code logic.

docs: Cập nhật tài liệu (README, comment...).

style: Cập nhật giao diện (CSS) hoặc format code.

refactor: Chỉnh sửa lại code nhưng không làm thay đổi logic hay tính năng.

📂 Cấu trúc thư mục
Chúng ta tổ chức dự án theo Features để dễ dàng quản lý các hệ Pet và Map:

</pre>
src/
├── assets/                       <-- Lưu trữ tài nguyên tĩnh
│   ├── images/                   <-- Hình ảnh thú cưng, icon hệ thống
│   └── audio/                    <-- File âm thanh cho Listening - Multi-modal Learning
│
├── components/                   <-- Các UI Component dùng chung toàn dự án
│   ├── ui/                       <-- Nút bấm (Button), Modal, TextField, Card...
│   └── layout/                   <-- Header, Sidebar, Container hiển thị tốt trên desktop/mobile
│
├── features/                     <-- Các module chính, tương ứng 1-1 với backend
│   │
│   ├── users/                    <-- Module Quản lý tài khoản và Onboarding
│   │   ├── api/                  <-- Chứa các hàm fetch/axios gọi API đến /users của backend
│   │   ├── components/           <-- Form đăng nhập, đăng ký, Survey Form (bài khảo sát 12-15 câu)
│   │   ├── store/                <-- State quản lý thông tin User và Auth Token
│   │   └── types/                <-- Interface định nghĩa User
│   │
│   ├── tutorials/                <-- Module Nền tảng kiến thức
│   │   ├── api/                  <-- Gọi API đến /tutorials
│   │   ├── components/           <-- Giao diện hiển thị Lesson Overview , Document, Code Example 
│   │   ├── store/                <-- State lưu trữ trạng thái lesson đang học dở hoặc đã hoàn thành
│   │   └── types/                <-- Interface Course -> Chapter -> Lesson 
│   │
│   ├── roadmaps/                 <-- Module Hệ thống Game / Đi map
│   │   ├── api/                  <-- Gọi API đến /roadmaps
│   │   ├── components/           <-- UI vẽ hệ thống map theo World (C++, Java, Python) 
│   │   ├── challenges/           <-- Giao diện cho các dạng bài: Multiple choice, Fill-in-the-blank, Ordering, Mini coding
│   │   ├── store/                <-- Quản lý tiến độ leo map, trạng thái unlock của các node 
│   │   └── types/                
│   │
│   ├── pets/                     <-- Module Hệ thống thú cưng
│   │   ├── api/                  <-- Gọi API đến /pets
│   │   ├── components/           <-- Pet Avatar, Chat Bubble(hiện tự động), menu Ask Pet / Need help? 
│   │   ├── store/                <-- Lưu trạng thái Pet Profile, level, exp 
│   │   └── types/                
│   │
│   └── histories/                <-- Module Tracking / Báo cáo học tập
│       ├── api/                  <-- Bắn API submit record history khi user hoàn thành node 
│       ├── components/           <-- Giao diện Dashboard hiển thị tiến độ , biểu đồ số sao và điểm 
│       ├── store/                <-- State quản lý dữ liệu lịch sử tạm thời
│       └── types/
│
├── hooks/                        <-- Các custom hooks dùng chung (vd: useAuth, usePetTrigger)
├── routes/                       <-- Định nghĩa các đường dẫn (Router)
├── stores/                       <-- Global state kết nối các module lại với nhau (vd: RootState)
├── utils/                        <-- Các hàm helper (vd: format thời gian, tính logic exp)
├── App.tsx                       <-- File entry của component
└── main.tsx                      <-- File khởi chạy React/Vue
</pre>

🚀 Hướng dẫn khởi chạy
Cài đặt (Sẽ tự động kích hoạt Husky):

PowerShell

<pre>
npm install
</pre>

Chạy môi trường Dev:

PowerShell

<pre>
npm run dev
</pre>

Lệnh hỗ trợ:

<pre>npm run lint: Kiểm tra lỗi logic/cú pháp.</pre>

</pre>npm run format: Tự động căn chỉnh lại toàn bộ code.</pre>

⚠️ Lưu ý kỹ thuật cho Windows (Fix lỗi Commit)
Nếu bạn gặp lỗi cannot spawn .husky/pre-commit khi thực hiện commit:

Mở file .husky/pre-commit trong VS Code.

Nhìn xuống góc dưới bên phải, đổi định dạng từ CRLF sang LF.

Đảm bảo Encoding là UTF-8.
