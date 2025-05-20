"use client"

export const TrashBox = () => {
    return (
        <div className="flex flex-col gap-2 p-4">
            <h2 className="text-lg font-semibold">Trash</h2>
            <p className="text-sm text-muted-foreground">
                Deleted documents are stored here for 30 days.
            </p>
        </div>
    );
}