import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; teamId: string } }
) {
  try {
    const supabase = await createClient()
    const { teamId } = params

    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", teamId)

    if (error) {
      console.error("Error deleting team:", error)
      return NextResponse.json(
        { error: "Failed to delete team" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Team deleted successfully"
    })
  } catch (error: any) {
    console.error("Error deleting team:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
