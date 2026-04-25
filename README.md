🎮 DevCopet - Gamified Programming Learning Platform
DevCopet là nền tảng học lập trình kết hợp nuôi thú cưng AI, tập trung vào trải nghiệm học tập qua cơ chế Game-map và Evolution Loop. Dự án được xây dựng trên nền tảng React + TypeScript + Vite với cấu trúc chuẩn Bulletproof.

🛠️ Bộ công cụ & Workflow
Dự án này áp dụng quy trình kiểm soát chất lượng tự động. Bạn không thể commit nếu code không sạch hoặc message không đúng chuẩn:

Husky & lint-staged: Tự động chạy Prettier để nắn dòng và ESLint để check lỗi ngay khi bạn gõ lệnh git commit.

Commitlint: Bắt buộc sử dụng chuẩn Conventional Commits. Mọi lời nhắn commit phải bắt đầu bằng:

feat: (tính năng mới)

fix: (sửa lỗi)

docs: (tài liệu/readme)

style:, refactor:, chore:...

📂 Cấu trúc thư mục
Chúng ta tổ chức dự án theo Features để dễ dàng quản lý các hệ Pet và Map:

</pre>
Plaintext
src/
├── assets/          # Hình ảnh Pet (Lửa, Nước, Lá), hiệu ứng tiến hóa
├── features/        # Các tính năng chính của game
│   ├── tutorial/    # Tài liệu học & Quiz trắc nghiệm
│   ├── game-map/    # Logic kéo thả code & Hệ thống Node
│   └── dashboard/   # Theo dõi sự phát triển của Pet
├── components/      # UI components dùng chung (Buttons, Modals)
└── types/           # Định nghĩa TypeScript cho Pet và User
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
