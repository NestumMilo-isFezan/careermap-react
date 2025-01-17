import { BaseEdge, EdgeProps, getSimpleBezierPath, getSmoothStepPath, getStraightPath, Position } from '@xyflow/react';


const PrerequisiteEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd }: EdgeProps) => {
    const [edgePath] = getSimpleBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        <BaseEdge
            id={id}
            path={edgePath}
            style={{
                strokeWidth: 2,
                stroke: '#10b981'
            }}
            markerEnd={markerEnd}
        />
      </>
    );
}

const PersonaEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data }: EdgeProps) => {
    const [edgePath] = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });

      return (
        <>
          <BaseEdge
              id={id}
              path={edgePath}
              style={{
                  strokeWidth: 2,
                  stroke: '#E11D48'
              }}
              markerEnd={markerEnd}
          />
        </>
      );
}

const DomainEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data }: EdgeProps) => {
    const [edgePath] = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{
                    strokeWidth: 2,
                    stroke: '#0ea5e9'
                }}
                markerEnd={markerEnd}
            />
        </>
    );
}

const UniversityEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data }: EdgeProps) => {
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{
                    strokeWidth: 2,
                    stroke: '#f59e0b'
                }}
                markerEnd={markerEnd}
            />
        </>
    );
}

const PreUniversityEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data }: EdgeProps) => {
    const [edgePath] = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{
                    strokeWidth: 2,
                    stroke: '#A855F7'
                }}
                markerEnd={markerEnd}
            />
        </>
    );
}

const CourseEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, data }: EdgeProps) => {
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{
                    strokeWidth: 2,
                    stroke: '#16a34a'
                }}
                markerEnd={markerEnd}
            />
        </>
    );
}

export { PrerequisiteEdge, PersonaEdge, DomainEdge, UniversityEdge, CourseEdge, PreUniversityEdge };
