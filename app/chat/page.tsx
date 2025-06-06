import DataDialogApp from "@/components/data-dialog-app"

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-150px)]">
      {" "}
      {/* Adjust height based on navbar/footer */}
      <DataDialogApp />
    </div>
  )
}
