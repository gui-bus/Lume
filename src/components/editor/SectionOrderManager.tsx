"use client";

import { useTranslations } from "next-intl";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVertical } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SectionOrderManagerProps {
  sectionsOrder: string[];
  onChange: (newOrder: string[]) => void;
}

interface SortableSectionItemProps {
  id: string;
  label: string;
}

function SortableSectionItem({ id, label }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 bg-card border border-border/40 rounded-xl shadow-sm text-left transition-all",
        isDragging && "opacity-80 scale-[1.02] shadow-md border-primary/50",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-muted-foreground/40 hover:text-primary transition-colors cursor-grab active:cursor-grabbing"
      >
        <DotsSixVertical size={18} weight="bold" />
      </button>
      <span className="text-sm font-bold text-foreground select-none">
        {label}
      </span>
    </div>
  );
}

export function SectionOrderManager({
  sectionsOrder,
  onChange,
}: SectionOrderManagerProps) {
  const t = useTranslations("common.editor.steps");

  const sectionLabelMap: Record<string, string> = {
    summary: t("profile") || "Resumo",
    experiences: t("journey") || "Experiência",
    educations: t("education") || "Formação",
    skills: t("stack") || "Habilidades",
    projects: t("projects") || "Projetos",
    languages: "Idiomas",
    certifications: "Certificações",
    volunteering: "Trabalho Voluntário",
    courses: "Cursos",
    customSections: "Seções Personalizadas",
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionsOrder.indexOf(active.id as string);
      const newIndex = sectionsOrder.indexOf(over.id as string);
      onChange(arrayMove(sectionsOrder, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionsOrder}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {sectionsOrder.map((sectionId) => (
              <SortableSectionItem
                key={sectionId}
                id={sectionId}
                label={sectionLabelMap[sectionId] || sectionId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
