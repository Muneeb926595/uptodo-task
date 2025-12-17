import React, { useState } from 'react'

export const useForceReRender = () => {
    const [value, setValue] = useState(0)
    return () => setValue(preValue => preValue + 1)
}

//Why need this hook
//for some cases the changes on UI don't render due to multiple reasons 
//and when we save our code it reflect the changes on UI that's because we need an extra rerender
//first of all try to solve the issue by debuging the problem if not able to find then use this hook
//because this hook can be costly in term of performance so try to avoid this

//how to use this hook
//1. const forceRender=useForceReRender()
//2. call forceRender where needed but make sure call this in setTimeout so this render don't get's mixed up with react render