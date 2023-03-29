import { useAnimationDispatch } from "@/contexts/AnimationContext";
import { useEffect } from "react";

export default function useResetAnimation(animationNames) {
  const dispatch = useAnimationDispatch();
  useEffect(() => {
    dispatch({
      type: 'reset',
      animationName: animationNames
    })
  }, [])
}