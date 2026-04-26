import fireEgg from "../../assets/fire.png";
import waterEgg from "../../assets/water.png";
import plantEgg from "../../assets/plant.png";

export interface EggData {
  id: number;
  name: string;
  desc: string;
  img: string;
}

export const EGGS_DATA: EggData[] = [
  {
    id: 1,
    name: "Fire Dragon",
    desc: "Phân tích lỗi cú pháp và gợi ý sửa lỗi Real-time giúp bạn tối ưu logic.",
    img: fireEgg,
  },
  {
    id: 2,
    name: "Water Spirit",
    desc: "Cung cấp các gợi ý về thuật toán và tối ưu hóa cấu trúc dữ liệu.",
    img: waterEgg,
  },
  {
    id: 3,
    name: "Forest Guardian",
    desc: "Yêu cầu hoàn thành bài kiểm tra nhanh để bảo vệ chuỗi học tập (Streak).",
    img: plantEgg,
  },
];
