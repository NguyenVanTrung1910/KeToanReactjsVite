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
    isOpen: boolean; // ✅ Nhận trạng thái từ component cha
    setIsOpen: (value: boolean) => void; // ✅ Nhận hàm set trạng thái từ component cha
}


const AddAndEditModal: React.FC<ModelProps> = ({ nameButton, content, title, isOpen, setIsOpen }) => {
    const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
    const [scrollableStatus, setScrollableStatus] = useState(false);
    const [centeredStatus, setCenteredStatus] = useState(false);
    const [sizeStatus, setSizeStatus] = useState<TModalSize>(null);
    const [fullScreenStatus, setFullScreenStatus] = useState<TModalFullScreen | undefined>(
        undefined,
    );
    const [animationStatus, setAnimationStatus] = useState(true);
    const [longContentStatus, setLongContentStatus] = useState(false);
    const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

    const initialStatus = () => {
        setStaticBackdropStatus(false);
        setScrollableStatus(false);
        setCenteredStatus(false);
        setSizeStatus(null);
        setFullScreenStatus(undefined);
        setAnimationStatus(true);
        setLongContentStatus(false);
        setHeaderCloseStatus(true);
    };
    return (
        <>

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
                <ModalBody>{content}</ModalBody>
                <ModalFooter>
                    <Button color='info' icon='Save'>
                        Cất giữ
                    </Button>
                    <Button color='success' icon='Save'>
                        Thêm tiếp
                    </Button>
                    <Button
                        color='danger'
                        //isOutline
                        className='border'
                        onClick={() => setIsOpen(false)}>
                        Đóng
                    </Button>

                </ModalFooter>
            </Modal>
        </>

    );
}

export default AddAndEditModal;