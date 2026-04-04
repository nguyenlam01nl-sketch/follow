import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "@/api/axios";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";

type Report = {
  id: number;
  target_type: string;
  target_value: string;
  title: string;
  content: string;
  amount?: number;
  status: string;
  created_at: string;
  evidences: { id: number; file_url: string }[];
};

export default function AdminReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchReports = async () => {
    try {
      const { data } = await api.get("/admin/reports", {
        params: statusFilter !== "all" ? { status: statusFilter } : {},
      });

      setReports(data.data || data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleApprove = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Duyệt báo cáo?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Duyệt",
    });

    if (!confirm.isConfirmed) return;

    await api.patch(`/admin/reports/${id}/approve`);

    Swal.fire("Đã duyệt!", "", "success");
    fetchReports();
  };

  const handleReject = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Từ chối báo cáo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Từ chối",
    });

    if (!confirm.isConfirmed) return;

    await api.patch(`/admin/reports/${id}/reject`);

    Swal.fire("Đã từ chối!", "", "success");
    fetchReports();
  };

  const getStatusBadge = (status: string) => {
    if (status === "approved")
      return "bg-green-500/20 text-green-300";
    if (status === "rejected")
      return "bg-red-500/20 text-red-300";
    return "bg-yellow-500/20 text-yellow-300";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-orange-400" />
            Quản lý báo cáo lừa đảo
          </h2>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#08152d] border border-white/10 text-white px-3 py-2 rounded-xl"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm text-white">
            <thead className="bg-[#0b1a35]">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Đối tượng</th>
                <th className="p-3 text-left">Tiêu đề</th>
                <th className="p-3 text-left">Số tiền</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-left">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-3">#{r.id}</td>
                  <td className="p-3">{r.target_value}</td>
                  <td className="p-3">{r.title}</td>
                  <td className="p-3">
                    {r.amount
                      ? r.amount.toLocaleString() + "đ"
                      : "-"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getStatusBadge(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => setSelected(r)}
                      className="p-2 rounded bg-white/10 hover:bg-white/20"
                    >
                      <Eye size={16} />
                    </button>

                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(r.id)}
                          className="p-2 rounded bg-green-500/20 text-green-300"
                        >
                          <CheckCircle2 size={16} />
                        </button>

                        <button
                          onClick={() => handleReject(r.id)}
                          className="p-2 rounded bg-red-500/20 text-red-300"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#08152d] p-6 rounded-2xl w-[90%] max-w-lg space-y-4">
              <h3 className="text-lg font-bold text-white">
                Chi tiết báo cáo #{selected.id}
              </h3>

              <div className="text-white/70">
                <b>Đối tượng:</b> {selected.target_value}
              </div>

              <div className="text-white/70">
                <b>Nội dung:</b> {selected.content}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {selected.evidences?.map((img) => (
                  <img
                    key={img.id}
                    src={img.file_url}
                    className="rounded-xl"
                  />
                ))}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-full bg-orange-500 py-2 rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}