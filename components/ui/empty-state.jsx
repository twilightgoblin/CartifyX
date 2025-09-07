"use client"

import { Button } from "@/components/ui/button"

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}
    </div>
  )
}
