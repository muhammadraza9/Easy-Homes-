'use client';

import { LeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'

export default function BackButton() {
  return (
    <Button
       icon = {<LeftOutlined />}
       className='mb-1'
       onClick={ () => window.history.back()}
     >
      Back
    </Button>
  )
}
