import React, { ReactNode, useState } from 'react';
import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
} from '../../components/bootstrap/Modal';
import { TModalFullScreen, TModalSize } from '../../type/modal-type';
import Button from '../../components/bootstrap/Button';
import contents from '../../routes/contentRoutes';

interface ModelProps {
    nameButton: string;
    content: ReactNode;
    title: string;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    includeButton: boolean;
}


const AddAndEditModal: React.FC<ModelProps> = ({ nameButton, content, title, isOpen, setIsOpen, includeButton }) => {
    const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
    const [scrollableStatus, setScrollableStatus] = useState(false);
    const [centeredStatus, setCenteredStatus] = useState(true);
    const [sizeStatus, setSizeStatus] = useState<TModalSize>('lg');
    const [fullScreenStatus, setFullScreenStatus] = useState<TModalFullScreen | undefined>(
        undefined,
    );
    const [animationStatus, setAnimationStatus] = useState(false);
    const [longContentStatus, setLongContentStatus] = useState(false);
    const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

    const initialStatus = () => {
        setStaticBackdropStatus(false);
        setScrollableStatus(false);
        setCenteredStatus(true);
        setSizeStatus('lg');
        setFullScreenStatus(undefined);
        setAnimationStatus(false);
        setLongContentStatus(false);
        setHeaderCloseStatus(true);
    };
    return (
        <>
            {includeButton && (
                <Button
                    className='btn btn-outline-info border-transparent btn-hover-shadow-lg shadow-none'
                    isLight
                    icon='Add'
                    onClick={() => {
                        initialStatus();
                        setAnimationStatus(false);
                        setCenteredStatus(true);
                        setSizeStatus('lg');
                        setIsOpen(true)
                    }}>
                    {nameButton}
                </Button>
            )}

            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                titleId='exampleModalLabel'
                isStaticBackdrop={staticBackdropStatus}
                isScrollable={scrollableStatus}
                isCentered={centeredStatus}
                size={sizeStatus}
                fullScreen={fullScreenStatus}
                isAnimation={animationStatus}>
                <ModalHeader setIsOpen={headerCloseStatus ? setIsOpen : undefined}>
                    <ModalTitle id='exampleModalLabel'>{title}</ModalTitle>
                </ModalHeader>
                <ModalBody>
                        {content}
                    </ModalBody>
                <ModalFooter>
                    {/* <Button color='info' icon='Save'>
                        Cất giữ
                    </Button>
                    <Button color='success' icon='Add' onClick={handleAddMore}>
                        Thêm tiếp
                    </Button> */}
                    {/* <Button
                        color='danger'
                        //isOutline
                        className='border'
                        onClick={() => setIsOpen(false)}>
                        Đóng
                    </Button> */}
<div></div>
                </ModalFooter>
            </Modal>
        </>

    );
}

export default AddAndEditModal;